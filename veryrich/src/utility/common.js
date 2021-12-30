
export const ClassColorText = (props) => {
    const {text, color} = props
    return <span style={{color: color || 'black'}}>{text}</span>
}
