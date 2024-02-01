const cores = [
    "#FF0000",
    "#00FF00",
    "#0000FF"
]

const emojis = [
    "🍒",
    "🍋",
    "🍇",
    "🍊",
    "🍉",
    "🥝",
    "🍀",
    "🎰",
    "💎",
    "🍄",
    "👽",
    "🐱",
    "🐸",
    "🦆",
    "🔔",
    "💲"
]
const numEmojis = emojis.length

const numCores = cores.length

export function gerarReels(tamanhoQuadrinho, numeroQuadrinhos){
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if(!ctx)
        throw "só pra fazer a cobrinha vermelha desaparecer."
    canvas.width = tamanhoQuadrinho*numeroQuadrinhos,
    canvas.height = tamanhoQuadrinho
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.font = (tamanhoQuadrinho*0.6) + "px arial"
    ctx.fillStyle="#FFFFFF"
    const noventa_graus = Math.PI/2
    for(let i = 0; i < numeroQuadrinhos; i++){
        ctx.fillRect(i * tamanhoQuadrinho, 0, tamanhoQuadrinho, tamanhoQuadrinho)
        ctx.save()
        ctx.translate(i * tamanhoQuadrinho + tamanhoQuadrinho/2,tamanhoQuadrinho/2)
        ctx.rotate(noventa_graus)
        ctx.fillText(emojis[i % numEmojis],0,0)

        ctx.restore()
    }

    return canvas
}