const admin = require('../lib/firebase')
const User = require('../models/user.model')

exports.createUser = async (req, res) => {
    const { name, email, password } = req.body

    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            })
        }

        // Check if user already exists in Firebase
        try {
            const firebaseUser = await admin.auth().getUserByEmail(email)
            return res.status(400).json({
                success: false,
                message: "User already exists in Firebase",
            })
        } catch (error) {
            if (error.code !== 'auth/user-not-found') {
                return res.status(500).json({
                    success: false,
                    message: "Error checking Firebase user",
                    error: error.message,
                })
            }
        }

        // Create user in Firebase
        const newFirebaseUser = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        })

        // Store user in MongoDB with Firebase UID
        const user = await User.create({
            name,
            email,
            firebaseId: newFirebaseUser.uid, // Store Firebase UID
        })

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            firebaseId: newFirebaseUser.uid, // Return Firebase UID
            data: user,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        })
    }
}


exports.login = async (req, res) => {
    const { idToken } = req.body;  // The frontend should send the Firebase ID token

    try {
        if (!idToken) {
            return res.status(400).json({
                success: false,
                message: "ID token is required"
            });
        }

        // Verify Firebase ID Token
        let decodedToken;
        try {
            decodedToken = await admin.auth().verifyIdToken(idToken);
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid Firebase token",
                error: error.message
            });
        }

        // Check if user exists in MongoDB
        let user = await User.findOne({ email: decodedToken.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found in MongoDB"
            });
        }

        // Generate JWT Token for session management
        const token = jwt.sign(
            { uid: decodedToken.uid, email: decodedToken.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: {
                firebaseId: decodedToken.uid,
                email: decodedToken.email,
                user
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};
