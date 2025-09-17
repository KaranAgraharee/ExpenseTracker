import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const navigate = useNavigate()
    const [Error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async (data) => {
        setIsLoading(true)
        try {
            const res = await fetch('https://expense-trackerapi.vercel.app/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include'
            });
            if(!res.ok){
                const responseData = await res.json();
                setError(responseData.message || "Login failed");
                setIsLoading(false)
                return
            }
            navigate('/Home')
        }catch (error) {
            setError(error.message || "An error occurred");
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className='flex justify-center items-center'>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                    duration: 0.6, 
                    ease: "easeOut",
                    type: "spring",
                    stiffness: 100
                }}
                className='w-full max-w-md '
            >
                <motion.form 
                    className='grid grid-cols-1 gap-6 p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20'
                    onSubmit={handleSubmit(onSubmit)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    <motion.h1 
                        className='text-center text-4xl font-bold bg-gradient-to-tr from-slate-900  bg-clip-text text-transparent p-4'
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        Login
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        <input
                            type="text"
                            className="w-full p-4 border-2 border-white/20 rounded-xl bg-black/10 text-black placeholder-Black/60 focus:border-blue-400 focus:outline-none transition-all duration-300"
                            {...register("email", { required: "email is required" })}
                            placeholder="Enter your Email"
                        />
                        {errors.email && (
                            <motion.p 
                                className="text-red-400 text-sm mt-1"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {errors.email.message}
                            </motion.p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        >
                        <div style={{ position: 'relative' }}>
                          <input
                              type={showPassword ? 'text' : 'password'}
                              {...register('password', {
                                  required: 'Password is required',
                                  minLength: {
                                      value: 6,
                                      message: 'Password must be at least 6 characters',
                                  },
                              })}
                              placeholder='Enter Your Password'
                              className="w-full p-4 border-2 border-white/20 rounded-xl bg-black/10 text-black placeholder-Black/60 focus:border-purple-400 focus:outline-none transition-all duration-300"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{
                              position: 'absolute',
                              right: '1rem',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#333',
                              fontWeight: 'bold',
                              fontSize: '1rem',
                            }}
                          >
                            {showPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                        {errors.password && (
                            <motion.p 
                            className="text-red-400 text-sm mt-1"
                            initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {errors.password.message}
                            </motion.p>
                        )}
                    </motion.div>
                    {Error && (
                        <motion.p 
                            className="text-red-400 text-sm mt-1"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {Error}
                        </motion.p>
                    )}
                    <motion.button 
                        className='w-full p-4 bg-gradient-to-r from-blue-500 to-teal-600 text-black font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'
                        type="submit"
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.6 }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </motion.button>
                </motion.form>
            </motion.div>
        </div>
    )
}

export default Login