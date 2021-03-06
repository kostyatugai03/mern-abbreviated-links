import React, {useState, useEffect, useContext} from 'react'
import { AuthContext } from '../context/AuthContext'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()
    const [form, setForm] = useState(
        {
            email: '',
            password: ''
        }
    )

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
            message(data.message)
            console.log(data, 'Data')
        } catch(e) {}
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId)
        } catch(e) {}
    }

    useEffect(() => {
        window.M.updateTextFields()
    })

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Сократи ссылку</h1>
                <div className="card blue darken-1">
                <div className="card-content white-text">
                    <span className="card-title">Авторизация</span>

                        <div>
                            <div className="input-field">
                                <input 
                                    placeholder="Введите email" 
                                    id="email" 
                                    type="text" 
                                    name="email"
                                    className="yellow-input"
                                    onChange={changeHandler}
                                    value={form.email}
                                /> 
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="input-field">
                                <input 
                                    placeholder="Введите password" 
                                    id="password" 
                                    type="password"
                                    name="password"
                                    className="yellow-input"
                                    onChange={changeHandler}
                                    value={form.password}
                                /> 
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>

                </div>
                <div className="card-action">
                    <button 
                        className="btn yellow darken-4" 
                        style={{marginRight: 10}}
                        disabled={loading}
                        onClick={loginHandler}
                    >
                        Войти
                    </button>
                    <button 
                        className="btn grey lighten-1 black-text"
                        onClick={registerHandler}
                        disabled={loading}
                    >
                        Регистрация
                    </button>                    
                </div>
                </div>
            </div>
        </div>
    )
}