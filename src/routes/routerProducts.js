import RouterMain from "./RouterMain.js";
import { users } from "../dao/factory.js";

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


}


export default new routerProducts()