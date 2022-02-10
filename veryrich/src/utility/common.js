
export const ClassColorText = (props) => {
    const {text, color} = props
    return <span style={{color: color || 'black'}}>{text}</span>
}

export const toPercent = (number,digits=0) => `${(Number.parseFloat(number)*100).toFixed(digits)}%`
