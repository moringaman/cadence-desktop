export default function (name) {
    if (name.indexOf(".") > -1) {
        let dotPos = name.indexOf(".")
        return name.split("").splice(0, dotPos).join("")
    } else {
        return name
    }
}
