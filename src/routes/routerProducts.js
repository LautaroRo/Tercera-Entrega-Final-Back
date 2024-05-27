import RouterMain from "./RouterMain.js";
import { users } from "../dao/factory.js";
import { CustomErrors } from "../CustomErrors/erros.js";
class routerProducts extends RouterMain{
    init(){
        this.get("/", this.getProducts)
        this.put("/updateProduct/:id", this.updateProduct)
        this.post("/addProduct", this.addProduct)
        this.delete("/deleteProduct", this.deleteProduct)
    }


    async getProducts(req,res) {
        const result = await users.getAll()
        res.json({products: result})
    }


    async addProduct(req,res){
        const {title, description, code, category,stock,thumbnails,status, price} = req.body

        if(!title || !description || !code || !category || !stock || !thumbnails || !status || !price) {
            const error = CustomErrors.Errors("Error al crear un prducto", "faltan parametros", 1001)
            res.json({error})
        }
        const obj = {
            title,
            description,
            code,
            category,
            stock,
            thumbnails: [thumbnails],
            status,
            price
        }

        users.addProduct(obj)
        res.send("Producto creado")
    }


}


export default new routerProducts()