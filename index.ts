import jwt from "jsonwebtoken";
import express from "express";
import { prisma } from "./db"
const app = express()

app.use(express.json());

app.post("/signup", async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await prisma.user.findFirst({
        where: {
            username: username
        }
    })

    if (existingUser) {
        return res.status(403).json({message: "User with this username already exists"})
    }

    const user = await prisma.user.create({
        data: {
            username: username,
            password: password
        }
    })

    res.json({
        id: user.id
    })
})

app.post("/signin", async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await prisma.user.findFirst({
        where: {
            username: username,
            password: password
        }
    })

    if (!userExists) {
        return res.status(403).json({
            message: "incorrect creds"
        })
    }

    const token = jwt.sign(userExists.id, "secret123123")

    res.json({
        token: token
    })


})

app.post("/todo", async(req, res) => {
    const token = req.headers.token;
    const id = jwt.verify(token, "secret123123")

    if (!id) {
        return res.status(403).json({
            message: "Token invalid"
        })
    }

    await prisma.todo.create({
        data: {
            userId: Number(id),
            title: req.body.title
        }
    })

    res.json({
        message: "Todo added"
    })
    
})

app.get("/todosAndUsernameAndPassword", async(req, res) => {
    const token = req.headers.token;
    const id = jwt.verify(token, "secret123123")

    if (!id) {
        return res.status(403).json({
            message: "Token invalid"
        })
    }

    const userData = await prisma.user.findFirst({
        where: {
            id: Number(id)
        },
        include: {
            purchases: {
                include: {
                    courses: true
                }
            }
        }
    })


    res.json({
        userData
    })
})


app.delete("/todo", async(req, res) => {
    const token = req.headers.token;
    const id = jwt.verify(token, "secret123123")

    if (!id) {
        return res.status(403).json({
            message: "Token invalid"
        })
    }

    await prisma.todo.delete({
        where: {
            id: req.body.todoId,
            userId: id
        }
    })

    res.json({
        message: "Todo deleted"
    })

})

app.listen(3000);