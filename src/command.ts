export default class Command {
    constructor(name: string, params: string[]){
        this.name = name
        this.params = params
    }
    name: string
    params: string[]
}