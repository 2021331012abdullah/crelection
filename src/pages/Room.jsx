import React, {useState, useEffect} from 'react'
import client, { databases, DATABASE_ID, COLLECTION_ID_MESSAGES } from '../appwriteConfig'
import { ID, Query, Permission, Role} from 'appwrite';
import Header from '../components/Header';
import { useAuth } from '../utils/AuthContext';
import {Trash2} from 'react-feather'
import udayImage from '../img/uday.jpg'
import tanzimImage from '../img/tanzim.jpg'
const sz=100
const Room = () => {
    const [messageBody, setMessageBody] = useState('')
    const [choice, setChoice] = useState("tanzim")
    const [voted, setVoted] = useState(null)
    const [cnt1, setCnt1] = useState(0)
    const [cnt2, setCnt2] = useState(0)
    const [messages, setMessages] = useState([])
    const {user, handleLogout} = useAuth()


    useEffect(() => {
        getMessages();
       
      
        const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`, response => {

            if(response.events.includes("databases.*.collections.*.documents.*.create")){
                setMessages(prevState => [response.payload, ...prevState])
            }

            if(response.events.includes("databases.*.collections.*.documents.*.delete")){
                setMessages(prevState => prevState.filter(message => message.$id !== response.payload.$id))
            }
        });

      
        return () => {
          unsubscribe();
        };
      }, []);

     

    const getMessages = async () => {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(1000),
            ]
        )
        
        try{
        const resp2 = await databases.getDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, user.$id);
        
        // const resp3 = await databases.getDocument(DATABASE_ID, 'candidates', 'uday');
        
        // const resp4 = await databases.getDocument(DATABASE_ID,'candidates', 'tanzim');
        
        // setCnt1(resp3.count);
        // setCnt2(resp4.count);
        setVoted(1)
        }
        catch (e)
        {
            setVoted(0)
        }
        setMessages(response.documents)
        
        

       

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (choice == 'blank') return;

        const permissions = [
            Permission.write(Role.user(user.$id)),
          ]

        const payload = {
            id:user.$id,
            username:user.name,
      
        }
        const present = await databases.getDocument(DATABASE_ID, 'candidates', choice);
        
        const payload2 = {
            count:present.count+1
      
        }
        const response = await databases.createDocument(
                DATABASE_ID, 
                COLLECTION_ID_MESSAGES, 
                user.$id, 
                payload,
                permissions
            )
            


            const response2 = await databases.updateDocument(
                DATABASE_ID, 
                'candidates',
                choice,
                payload2,
                permissions
            )
            window.location.reload(false);
            

    }


    

  return (
    <main className="container">
        <Header/>
        <div className="room--container">
            
        <div>
            {voted===1 ?
            (<>
                <div className='message--header'>
                    <h2>আগে ছবি তে ক্লিক করে তারপর ভোট দিন নিচের বাটন চাপলে আর পরিবর্তন করার সুযোগ থাকবে না</h2>
                    <br></br>
                    <div className='center-align'><img src={udayImage} width={sz} height={sz} alt="uday" /><h2>Uday</h2></div>
                    
                    <div className='center-align'><img src={tanzimImage} width={sz} height={sz} alt="tanzim" /><h2>Tanzim</h2></div>
                    <br/>
                    <br/>
                    </div >
                    <br/>
                    <div className='center-align'>Final result will be announced after 10PM</div>
                    
                    
                    <br/>
                
                <br />
                <p>✅ আপনি ইতোমধ্যে একবার ভোট দিয়েছেন</p></>): voted===0?
        (<div> <div className='message--header'>
            {/* The first radio button is checked by default using the defaultChecked attribute */}
            <label><input type='radio' name="favourite" value="uday" onChange={()=>{setChoice("uday"); }}></input><img src={udayImage} width={sz} height={sz} alt="uday" /></label>
            <label><input type='radio' name="favourite" value="tanzim" defaultChecked onChange={()=>{setChoice("tanzim");}}></input><img src={tanzimImage} width={sz} height={sz} alt="tanzim" /></label><br/>
            <span ><input className="button-5" type="submit" value="ভোট দিন" onClick={(e)=>{handleSubmit(e)}}></input></span>
            <br/>
            
        </div>
        <br></br>
            </div>
        
        ):(<><div class="loader1"></div></>)
            }
        </div>

       
        
<br/>
        <div>
        <br></br>
            <br></br>

            {voted!=null? (<h3>Latest Activites</h3>):(<></>)}
            <br/>
            {messages.map(message => (
                <div key={message.$id} className={"message--wrapper"}>
                    <div className="message--header">
                        
                        <p> 
                            
                                <small> {message.username} </small>
                        
                            <small className="message-timestamp"> voted on {new Date(message.$createdAt).toLocaleString()}</small>
                        </p>

                        
                    </div>

                    <br></br>
                        
            
                </div>
            ))}
        </div>
        </div>
    </main>
  )
}

export default Room
