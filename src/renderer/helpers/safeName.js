export default function(name) {
    let dotPos = name.indexOf(".")//?
    return name.split("").splice(0, dotPos).join("")
} 
//?