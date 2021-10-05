import React, {useState, useContext, useCallback, useEffect} from 'react'
import {Loader} from '../components/Loader'
import { useHttp } from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {LinksList} from '../components/LinksList'

export const LinksPage = () => {
    const [links, setLinks] = useState([])
    const {token} = useContext(AuthContext)
    const {request, loading} = useHttp() 

    const fetchLinks = useCallback(async () => {
        const fetched = await request('/api/link', 'GET', null, {
            Authorization: `Bearer ${token}`
        })
        setLinks(fetched)
    }, [token, request])

    useEffect(() => {
        fetchLinks()
    }, [fetchLinks])

    if(loading) {
        <Loader/>
    }

    return (
        <>
            {!loading && <LinksList links={links} />}
        </>
    )
}