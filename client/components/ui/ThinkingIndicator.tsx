import { LuLoader } from "react-icons/lu"

export default function ThinkingIndicator() {
    return (
        <div className="flex gap-[5px] align-center">
            <LuLoader />
            <p>AI is thinking</p>
        </div>
    )
}