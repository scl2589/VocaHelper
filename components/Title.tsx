export default function Title({title}: {title: string}) {
    return (
        <h1
            className="text-2xl md:text-3xl tracking-tight font-bold text-blue-dark dark:text-white">{title}</h1>
    )
}