import RouterMain from "./RouterMain.js";
import { users } from "../dao/factory.js";
import { CustomErrors } from "../CustomErrors/erros.js";
class routerProducts extends RouterMain {
    init() {
        this.get("/", this.getProducts)
        this.put("/updateProduct/:id", this.updateProduct)
        this.post("/addProduct", this.addProduct)
        this.delete("/deleteProduct", this.deleteProduct)
        this.get("/createProducts", this.renderPageCreate)
    }


    async getProducts(req, res) {
        const result = await users.getAll()
        res.json({ products: result })
    }


    async deleteProduct(req, res) {
        try {
            const user = req.cookies.user
            const userParser = JSON.parse(user)
            const idProduct = req.body.id

            if (userParser.role === "Usuario") return res.json({ error: "No tienes el rango necesario" })
            
            const product = await users.getProductById(idProduct)

            if(product.owner !== userParser.email && userParser.role === "Premium") return res.json({ error: "No tienes el rango necesario y tmapooc eres el dueño del producto" })
            await users.deleteProduct(idProduct)

            res.json({ user: userParser })
        }
        catch (error) {
            console.log(error)
        }


    }
    async addProduct(req, res) {
        const { title, description, category, stock, thumbnails, price, brands } = req.body

        const dueño = req.cookies.user
        console.log(dueño, "holas")
        const dueñoParse = JSON.parse(dueño)
        const dueñoName = `${dueñoParse.email}`
        console.log(dueñoName)
        if (!title || !description || !category || !stock || !thumbnails || !price) {
            const error = CustomErrors.Errors("Error al crear un prducto", "faltan parametros", 1001)
            res.json({ error: error })
        }

        let codigo = []

        for (let i = 0; 8 > i; i++) {
            const posibilidades = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
            const numero = Math.floor(Math.random() * posibilidades.length);
            const valor = posibilidades.charAt(numero);

            codigo.push(valor)
        }

        const obj = {
            title,
            description,
            code: codigo.join(""),
            category,
            stock,
            thumbnails: [{ img: thumbnails }],
            status: true,
            brands,
            price,
            owner: dueñoName
        }

        users.addProduct(obj)
        res.send("Producto creado")
    }

    async renderPageCreate(req, res) {
        const user = req.cookies.user;
        const userObject = JSON.parse(user);
        const roleValue = userObject.role;
        if (!user) return res.json({ error: "Lo sentimos parece que no tienes una sesion creada" })
        if (roleValue !== "Premium") return res.json({ error: "Lo sentimos parece que no tienes el grado Premium" })

        return res.render("createProduct");

    }

}


export default new routerProducts()