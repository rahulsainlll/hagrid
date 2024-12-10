import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "./components/ui/button";

export default function LandingPage() {
	const [query, setQuery] = useState<string>("");
	const navigate = useNavigate();

	const handleSearch = () => {
		if (query.trim()) {
			navigate("/search", { state: { query } });
		}
	};

	return (
		<div className="min-h-screen bg-black text-white overflow-hidden">
			<main>
				{/* Background Gradient and Animated Circles */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black animate-bg" />
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/30 rounded-full blur-3xl animate-circle" />
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-purple-500/20 rounded-full animate-pulse" />
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-purple-500/20 rounded-full animate-pulse" />
					{/* Rotating Circles */}
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] animate-rotateCircle">
						{[...Array(8)].map((_, i) => (
							<div
								key={i}
								className="absolute w-2 h-2 bg-purple-400 rounded-full"
								style={{
									top: "50%",
									left: "50%",
									transform: `rotate(${i * 45}deg) translateX(300px)`,
								}}
							/>
						))}
					</div>
				</div>

				{/* Main Content */}
				<div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4">
					<h1 className="text-7xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent animate-heading">
						Hagrid
					</h1>
					<p className="max-w-2xl text-xl md:text-2xl text-gray-300 mb-12 animate-fadeIn">
						Search, Explore and Index the Data of the Arweave Ecosystem
					</p>

					<div className="w-full max-w-md">
						<div className="flex space-x-4">
							<input
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search the transaction ..."
								className="flex-grow px-4 py-2 text-black border border-gray-300 rounded-l-md text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
								onKeyDown={(e) => e.key === "Enter" && handleSearch()}
							/>
							<Button
								onClick={handleSearch}
								className="flex items-center px-6 py-2 text-xl text-white transition-transform transform hover:scale-105 bg-[#9b4dca] rounded-r-md hover:bg-[#7a34a5]"
								style={{ minHeight: "150%" }}
							>
								<Search className="mr-2" size={60} />
								Search
							</Button>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
