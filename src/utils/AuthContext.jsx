import { createContext, useState, useEffect, useContext } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router";
import { ID} from 'appwrite';

const AuthContext = createContext()



export const AuthProvider = ({children}) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        getUserOnLoad()
    }, [])

    const getUserOnLoad = async () => {
        try{
            let accountDetails = await account.get();
            setUser(accountDetails)
        }catch(error){
            
        }
        setLoading(false)
    }

    const handleUserLogin = async (e, credentials) => {
        e.preventDefault()
        

        try{
            let response = await account.createEmailSession(credentials.email, credentials.password)
            let accountDetails = await account.get();
            setUser(accountDetails)
            navigate('/')
        }catch(error){

            const ex=String(error)
            
            alert(ex.replace('AppwriteException: ', ''))
            console.error(error)
        }
    }

    const handleLogout = async () => {
        const response = await account.deleteSession('current');
        setUser(null)
    }

    

    const contextData = {
        user,
        handleUserLogin,
        handleLogout,
    }

    return(
        <AuthContext.Provider value={contextData}>
            {loading ? (

                <div class="loader">
                <div class="loaderBar"></div>
                </div>

            ) : children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=> {return useContext(AuthContext)}

export default AuthContext;