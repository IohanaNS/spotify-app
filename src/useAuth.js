import {useState, useEffect} from 'react'
import axios from 'axios'

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()

    useEffect(() => {	
        axios.post('http://localhost:3001/login', {
            code
        }).then(response => {
            setAccessToken(response.data.accessToken)
            setRefreshToken(response.data.refreshToken)
            setExpiresIn(response.data.expiresIn)


            console.log(response.data)
            window.history.pushState({}, null, '/')
        }).catch(err => {
            console.error(err)
            window.location = '/'
        })
    }, [code])

    useEffect(() => {
        if (!refreshToken || !expiresIn) return
        const interval = setInterval(() => {
          axios
            .post("http://localhost:3001/refresh", {
              refreshToken,
            })
            .then(res => {
              setAccessToken(res.data.accessToken)
              setExpiresIn(res.data.expiresIn)
            })
            .catch(() => {
              window.location = "/"
            })
        }, (expiresIn - 60) * 1000)
    
        return () => clearInterval(interval)
      }, [refreshToken, expiresIn])
    
      return accessToken
}