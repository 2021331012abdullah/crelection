import React, {useState, useEffect} from 'react'
import client, { databases, DATABASE_ID, COLLECTION_ID_MESSAGES } from '../appwriteConfig'
import {Query} from 'appwrite';
import { useNavigate } from 'react-router-dom';
import santoshImage from '../img/santosh.jpg'
import sayeedImage from '../img/sayeed.jpg'
const sz=100
const Guest = () => {
    const navigate = useNavigate()
    const [voted, setVoted] = useState(null)
    const [cnt1, setCnt1] = useState(0)
    const [cnt2, setCnt2] = useState(0)
    const [messages, setMessages] = useState([])


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
        
        const resp3 = await databases.getDocument(DATABASE_ID, 'candidates', 'santosh');
        console.log(resp3)
        const resp4 = await databases.getDocument(DATABASE_ID,'candidates', 'sayeed');
        console.log(resp4)
        setCnt1(resp3.count);
        setCnt2(resp4.count);
        setVoted(1)
        }
        catch (e)
        {
            console.loge(e);
        }
        setMessages(response.documents)
        
        

       

    }

    
  return (
    <main className="container">
        <div className="room--container">
            
        <div>
            {voted===1 ?
            (<>
                <div className='message--header'>
                    <br></br>
                    <div className='center-align'><img src={santoshImage} width={sz} height={sz} alt="santosh" /><h2>SANTOSH {cnt1}</h2></div>
                    
                    <div className='center-align'><img src={sayeedImage} width={sz} height={sz} alt="sayeed" /><h2>SAYEED {cnt2}</h2></div>
                    <br/>
                    <br/>
                    </div >
                    <br/>
                    <div className='center-align'>Final result will be announced after the voting is over</div>
                    
                    
                    <br/>
                    <div className='center-align'><div className="field--wrapper">

<input 
type="submit"
value="Login to Vote"
className="btn btn--lg btn--main"
onClick={()=>{navigate('/login')}}
/>

</div></div>
                
                <br />
                <p>You are viewing this page as a guest!</p></>):(<><p>লোড হচ্ছে... অনুগ্রহপূর্বক অপেক্ষা করুন</p></>)
            }
        </div>

       
        
<br/>
        <div>
        <br></br>
            <br></br>

            <h3>Latest Activites</h3>
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

export default Guest
