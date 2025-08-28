import {transporter} from './email.config.js'
import { verification_Email_Template } from '../libs/emailTemp.js';

export const SendVerificationCOde = async(email, verificationCode)=> {
    try {
        if(!email){
            throw new Error ('recipient mail is missing')
        }
        const response = await transporter.sendMail({
          from: '"expenseTracker" <karanagraharee@gmail.com>', 
          to: email ,
          subject: "Verify you Email",
          text: `verify your Email`,
          html: verification_Email_Template(verificationCode) ,
        })      
        console.log("Message sent: %s")
    } catch (error) {
        console.log(error)
    }
}