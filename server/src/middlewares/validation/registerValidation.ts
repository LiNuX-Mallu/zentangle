import { Request, Response, NextFunction } from "express";
import User from "../../models/user";

interface Body {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    dob: Date;
    password: string;
}

type Errors = {
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    password: string,
    dob: string,
}

export default async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as Body;
    const {
        username,
        firstname,
        lastname,
        email,
        phone,
        password,
    } = body;
    
    const dob = new Date(body.dob);

    const errors = <Errors>{};

    const usernameRegex = /^[a-z0-9_.]{3,}$/;
    const nameRegex = /^\p{L}{3,}$/u;
    const emailRegex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    const phoneRegex = /^\d+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (await User.findOne({username})) {
        errors.username = "Username taken";
    } else if (!usernameRegex.test(username)) {
        errors.username = "Username only accepts number, undercore, dot and english alphabets"
    }

    if (!nameRegex.test(firstname)) {
        errors.firstname = "Name should not contain special characters or white spaces";
    }

    if (!nameRegex.test(lastname)) {
        errors.lastname = "Name should not contain special characters or white spaces";
    }

    if (await User.findOne({email})) {
        errors.email = "Email already exists";
    } else if (!emailRegex.test(email)) {
        errors.email = "Please provide a valid email";
    }

    if (await User.findOne({phone})) {
        errors.phone = "Phone number already exists";
    } else if (!phoneRegex.test(phone)) {
        errors.phone = "Please provide a valid phone number";
    }

    if (!passwordRegex.test(password)) {
        errors.password = "Password must be atleast 8 characters long with one lowercase, uppercase, special character and number";
    }

    if (isNaN(dob.getTime())) {
        errors.dob = "Invalid date";
    } else {
        const dateOfBirth: Date = new Date(dob);
        const dateNow: Date = new Date();
        const age = (dateNow.getFullYear() - dateOfBirth.getFullYear());
        if (age < 18) {
            errors.dob = "Must be eighteen years old";
        }
    }

    if (Object.keys(errors).length === 0) {
        next();
    } else {
        return res.status(400).json({message: "Validation failed", errors});
    }
};