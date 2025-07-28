'use client'
import React, { useEffect, useState } from 'react'
import { Input } from '../input/input'
import { Button } from '../button/button'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ApiSignup } from '@/api/client';
import store from '@/redux/store';
import { setModal } from '@/redux/reducer/ModalReduce';
import { useRouter } from 'next/navigation';


const SignupCard = () => {

    const toPage = useRouter()

    const [_username, set_username] = useState<string>("")
    const [_password, set_password] = useState<string>("")
    const [_email, set_email] = useState<string>("")
    const [_pwHidden, set_pwHidden] = useState<boolean>(true)

    const [isError, setIsErrors] = useState<boolean>(true)
    const [Error, setErrors] = useState<{ username?: string, password?: string, email?: string }>({})

    const apicheckusername = process.env.api_url + "api/checkuser?username="
    const apicheckemail = process.env.api_url + "api/checkuser?email="
    useEffect(() => {
        const validateForm = async () => {
            const errors: { username?: string, password?: string, email?: string } = {}

            if (_username.length != 0 && 6 > _username.length) {
                errors.username = `username must be longer than 6 character`
            }
            if (_username && apicheckusername) {
                const isusername = await fetch(apicheckusername + _username)
                    .then((res) => res.json())
                    .then((data) => data)
                if (isusername) { errors.username = "username is Exited" }
            }
            if (!/\S+@\S+\.\S+/.test(_email) && _email.length != 0) {
                errors.email = 'this email is not valid';
            }
            if (_email && apicheckemail) {
                const isEmail = await fetch(apicheckemail + _email)
                    .then((res) => res.json())
                    .then((data) => data)
                if (isEmail) { errors.email = "email is existed" }
            }
            if (_password.length != 0 && _password.length < 6) {
                errors.password = `password must be longer than 6 character`;
            }

            setIsErrors(Object.keys(errors).length || _username === "" || _password === "" || _email === "" ? true : false);
            setErrors(errors)
        }
        if (validateForm) {
            validateForm();
        }
    }, [_username, _password, _email, apicheckusername, apicheckemail]);
    const signup = async (data: { username: string, password: string, email: string }) => {

        const result = await ApiSignup(data)
        if (result.success) {
            store.dispatch(setModal({ open: true, type: "notification", msg: result.msg, value: "" }))
            setTimeout(() => {
                store.dispatch(setModal({ open: false, type: "", msg: "", value: "" }))
                toPage.push("/login")
            }, 5000)
        }
    }
    return (
        <div className='w-11/12 min-h-96 max-w-(--sm) m-auto bg-slate-50 shadow p-4 md:p-8 flex flex-col justify-center rounded'>
            <div className='text-xl font-bold text-center mb-12 text-sky-600'>LOGIN</div>
            <div className='md:flex gap-4'>
                <div className='opacity-75 w-24 flex flex-col justify-center'>username</div><Input value={_username} onchange={(v) => set_username(v)} />
            </div>
            <div className="h-max text-xs text-red-500 text-center">{Error.username ? Error.username : null}</div>
            <div className='md:flex gap-4'>
                <div className='opacity-75 w-24 flex flex-col justify-center'>password</div><Input value={_password} onchange={(v) => set_password(v)} type={_pwHidden ? 'password' : "text"}
                    icon={_pwHidden ? <VisibilityOffIcon className='cursor-pointer' onClick={() => set_pwHidden(false)} /> : <VisibilityIcon className='cursor-pointer' onClick={() => set_pwHidden(true)} />} />
            </div>
            <div className="h-max text-xs text-red-500 text-center">{Error.password ? Error.password : null}</div>
            <div className='md:flex gap-4'>
                <div className='opacity-75 w-24 flex flex-col justify-center'>email</div><Input value={_email} onchange={(v) => set_email(v)} />
            </div>
            <div className="h-max text-xs text-red-500 text-center">{Error.email ? Error.email : null}</div>
            <Button disable={isError} name="SIGN UP" onClick={() => {
                signup({ username: _username, password: _password, email: _email })
            }} />
        </div>
    )
}

export default SignupCard