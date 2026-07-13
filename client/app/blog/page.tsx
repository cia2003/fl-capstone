import SearchBar from "../../components/ui/SearchBar";

export default function Blog() {
	return (
		<div className="flex min-h-screen items-start justify-center py-8">
			<div className="w-full max-w-3xl px-4">
				<SearchBar />
			</div>
		</div>
	);
}