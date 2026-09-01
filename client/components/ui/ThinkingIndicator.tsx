import { LuLoader } from "react-icons/lu"

export default function ThinkingIndicator() {
    return (
        <div data-testid="thinking-indicator" className="flex gap-[5px] items-center mt-2">
            <LuLoader className="text-gray-500" />
            <p className="font-medium text-gray-500">AI is thinking</p>
        </div>
    )
}