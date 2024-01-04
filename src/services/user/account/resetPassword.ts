import dotenv from 'dotenv';
import User from '../../../models/user';
import transporter from '../../../instances/transporter';

dotenv.config();

let { EMAIL } = process.env;

export default async (username: string) => {
    try {
        const tempPassword = username + Math.floor(100000 + Math.random() * 900000) + 'T3mp';

        const user = await User.findOneAndUpdate({
            $or: [
                {'email.email': {$eq: username.toLowerCase()}},
                {username: {$eq: username.toLowerCase()}},
            ]
        }, {
            $set: {password: tempPassword},
        }, {new: true});

        if (!user) {
            return {error: "Couldn't find user with provided username or email"};
        }

        const mailOption = {
            from: EMAIL,
            to: user.email?.email,
            subject: "Email Verification",
            text: `Your temporary password is ${tempPassword}.\nDo not share with anyone.`,
        };
    
        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOption, (error, _) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(true);
                }
            });
        })
        .then(() => {
           return {error: null};
        })
        .catch((error) => {
            throw error;
        });
        return {error: null};
        
    } catch (error) {
        throw new Error("Error at service/user/account/resetPassword\n"+error);
    }
}