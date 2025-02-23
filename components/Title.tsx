export default function Title({title}: {title: string}) {
    return (
        <h3
            className="text-xl md:text-2xl font-bold text-blue-dark dark:text-white">{title}</h3>
    )
}