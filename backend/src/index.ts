import express, { Request, Response } from 'express'

const app = express()
const port = process.env.PORT || 8080

app.get('/', (_req: Request, res: Response) => {
	res.send('Express Typescript on Vercel')
    return
})

app.get('/ping', (_req: Request, res: Response) => {
	res.send('pong 🏓')
    return
})

app.listen(port, () => {
	return console.log(`Server is listening on ${port}`)
})