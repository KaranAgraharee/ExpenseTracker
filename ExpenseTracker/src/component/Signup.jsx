import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { motion } from 'motion/react'
import {useNavigate} from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'https://expense-trackerapi.vercel.app'

const OTPVerification = ({ email, signupData, onVerificationComplete, onBack }) => {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      if (value && index < 5) {
        const nextInput = document.querySelector(`input[data-index="${index + 1}"]`)
        if (nextInput) nextInput.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setError('Please enter a 6-digit OTP')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      const otpnum = Number(otpString)
      const timeout = Date.now() + 10 * 60 * 1000
      const res = await fetch(`${API}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, otp: otpnum, timeout })
      })
      const rs = await res.json()
      console.log(rs)
      if (!res.ok) {
        setError(rs.message)
        setIsLoading(false)
        return
      }
      // 2. Register user after OTP is verified
      const signupPayload = { ...signupData }
      delete signupPayload.confirmPassword
      const signupRes = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupPayload),
         credentials: 'include'
      })
      if (signupRes.ok) {
        navigate('/Home')
        onVerificationComplete()
      } else {
        setError('Signup failed. Please try again.')
      }
    } catch {
      setError('Verification or signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resendOTP = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      if (res.ok) {
        setError('')
        setOtp(['', '', '', '', '', ''])
      } else {
        setError('Failed to resend OTP. Please try again.')
      }
    } catch {
      setError('Failed to resend OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", type: "spring", stiffness: 100 }}
      className='w-full max-w-md'
    >
      <motion.form 
        className='form-container -translate-y-6'
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <motion.h1 
          className='form-title'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Verify OTP
        </motion.h1>
        <motion.p 
          className='text-center text-gray-600 mb-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          We've sent a 6-digit code to <span className="font-semibold">{email}</span>
        </motion.p>
        <motion.div
          className='flex justify-center gap-2 mb-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              data-index={index}
              className="input-otp"
            />
          ))}
        </motion.div>
        {error && (
          <motion.p 
            className="error-text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
        <motion.button 
          className='btn-primary'
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </motion.button>
        <motion.div
          className='flex justify-between items-center mt-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <button
            type="button"
            onClick={onBack}
            className='btn-link'
          >
            ← Back to Sign Up
          </button>
          <button
            type="button"
            onClick={resendOTP}
            disabled={isLoading}
            className='btn-link-purple'
          >
            Resend OTP
          </button>
        </motion.div>
      </motion.form>
    </motion.div>
  )
}

const SignUp = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [showOTP, setShowOTP] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [signupData, setSignupData] = useState(null)

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // Send OTP only
      const res = await fetch(`${API}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      })
      if (res.ok) {
        setSignupData(data)
        setShowOTP(true)
      } else {
        console.log('server Error')
      }
    } catch (error) {
        console.log(error) 
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerificationComplete = () => {
    // Handle successful verification - redirect to login or dashboard
    console.log('OTP verification and signup successful!')
    // You can add navigation logic here
  }

  const handleBackToSignup = () => {
    setShowOTP(false)
  }

  if (showOTP && signupData) {
    return (
      <div className='flex justify-center items-center py-4'>
        <OTPVerification 
          email={signupData.email}
          signupData={signupData}
          onVerificationComplete={handleVerificationComplete}
          onBack={handleBackToSignup}
        />
      </div>
    )
  }

  return (
    <div className='flex justify-center items-center  py-4 '>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", type: "spring", stiffness: 100 }}
        className='w-full max-w-md'
      >
        <motion.form 
          className='grid grid-cols-1 -translate-y-6 gap-4 p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20'
          onSubmit={handleSubmit(handleFormSubmit)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <motion.h1 
            className='text-center text-4xl pb-2 font-bold bg-gradient-to-r from-gray-400 to-blue-900 bg-clip-text text-transparent'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Sign Up
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <input
              type="text"
              className="input-field focus:border-fuchsia-300"
              {...register("name", { required: "Name is required" })}
              placeholder="Enter your name"
            />
            {errors.name && (
              <motion.p 
                className="error-text"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.name.message}
              </motion.p>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <input
              type="text"
              className="input-field focus:border-fuchsia-400"
              {...register("email", { required: "email is required" })}
              placeholder="Enter your Email"
            />
            {errors.email && (
              <motion.p 
                className="error-text"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.email.message}
              </motion.p>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              placeholder='Set Your Password'
              className="input-field focus:border-fuchsia-500"
            />
            {errors.password && (
              <motion.p 
                className="error-text"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.password.message}
              </motion.p>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
                validate: (value, formValues) =>
                  value === formValues.password || 'Passwords do not match',
              })}
              className="input-field focus:border-fuchsia-600"
              placeholder='Confirm Password'
            />
            {errors.confirmPassword && (
              <motion.p 
                className="error-text"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.confirmPassword.message}
              </motion.p>
            )}
          </motion.div>
          <motion.button 
            className='btn-primary'
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  )
}

export default SignUp