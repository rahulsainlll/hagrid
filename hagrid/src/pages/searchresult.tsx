import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Loader2Icon,
	Search,
	TableIcon as TableOfContents,
} from "lucide-react";
import { performQueryDryrun } from "../actions";

import Spline from "@splinetool/react-spline";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../components/ui/tooltip";
import { cn } from "../lib/utils";

interface Project {
	title: string;
	link: string;
	description: string;
	twitter?: string;
}

type TabType = 'projects' | 'process' | 'images' | 'txn' | 'data';

export default function SearchPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const [query, setQuery] = useState<string>("");
	const [results, setResults] = useState<Project[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [hasSearched, setHasSearched] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<TabType>('projects');

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const urlQuery = urlParams.get('query');
		const stateQuery = location.state?.query;
		
		const searchQuery = urlQuery || stateQuery;
		
		if (searchQuery) {
			setQuery(searchQuery);
			performSearch(searchQuery);
		}
	}, [location.search, location.state]);
 
	console.log(hasSearched)
	
	const performSearch = async (searchTerm: string) => {
		setLoading(true);
		setHasSearched(true);
		setError(null);
		
		if (searchTerm.length < 2) {
			setError("Please enter at least 2 characters to search");
			setLoading(false);
			setResults([]);
			return;
		}

		try {
			const queryResult = await performQueryDryrun(searchTerm);
			if (queryResult && Array.isArray(queryResult)) {
				setResults(queryResult);
			}
		} catch (error) {
			console.error("Search error:", error);
			setError("An error occurred while searching. Please try again.");
			setResults([]);
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = () => {
		if (query.trim()) {
			navigate(`/search?query=${encodeURIComponent(query)}`);
			performSearch(query);
		}
	};

	const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleSearch();
		}
	};

	const goToIndexPage = () => {
		navigate("/index");
	};

	const NoResultsMessage = () => (
		<div className="flex justify-center w-full mt-32 text-gray-400">
			<div className="flex flex-col items-center justify-center w-[80%]">
				{error ? (
					<h1 className="mb-4 text-lg text-center text-red-400">
						{error}
					</h1>
				) : (
					<h1 className="mb-4 text-lg text-center">
						Can't find what you're looking for? 🤔 Maybe it's time to
						index your thoughts 🧠 and dig it out yourself—hehehe! 🔍📚
					</h1>
				)}
				<button
					type="button"
					onClick={goToIndexPage}
					className="p-4 text-sm text-white bg-purple-700 rounded-full hover:shadow-lg hover:bg-purple-800"
					aria-label="Go to Index Page"
				>
					Index Your Project Here!!
				</button>
			</div>
		</div>
	);

	const tabs: { label: string; value: TabType }[] = [
		{ label: 'Projects', value: 'projects' },
		{ label: 'Process', value: 'process' },
		{ label: 'Images', value: 'images' },
		{ label: 'Transactions', value: 'txn' },
		{ label: 'Data', value: 'data' }
	];

	const renderTabContent = () => {
		switch (activeTab) {
			case 'projects':
				return (
					<div className="space-y-6">
						{results.map((project, index) => (
							<ProjectCard key={project.link} project={project} index={index}/>
						))}
					</div>
				);
			default:
				return (
					<div className="flex items-center justify-center h-40 text-neutral-400">
						Coming soon...
					</div>
				);
		}
	};

	return (
		<main className="min-h-screen bg-black">
			<div className="fixed inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/20 to-black" />
			<div className="fixed inset-0">
				<Spline
					scene="https://prod.spline.design/FQ5bVLNMRZ3SN87K/scene.splinecode"
					className="scale-[100%]"
				/>
			</div>

			<div className="relative z-20">
				<div className="max-w-4xl px-6 py-8 mx-auto">
					<div className="flex items-center gap-2 mb-8 ">
						<TooltipProvider delayDuration={0}>
							<Tooltip>
								<TooltipTrigger>
									<button
										type="button"
										onClick={goToIndexPage}
										className="relative p-2 font-semibold text-white transition-colors bg-purple-700 rounded-xl"
										aria-label="Go to Index Page"
									>
										<TableOfContents size={18} />
									</button>
								</TooltipTrigger>
								<TooltipContent side="bottom">
									<p>Index yourself</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<div className="relative flex flex-grow">
							<input
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="Search projects..."
								className="relative z-10 flex-grow w-full h-full px-4 py-2 text-white transition-all border-2 shadow-2xl outline-none animate-in fade-in-0 placeholder-neutral-400 smooth-transition bg-neutral-200 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border-neutral-700 hover:border-neutral-600 "
								aria-label="Search projects"
							/>

							<button
								type="button"
								className="absolute z-10 top-[50%] hover:text-white focus:text-white text-neutral-400 -translate-y-1/2 right-4 smooth-transition"
								onClick={handleSearch}
								aria-label="Search"
							>
								<Search size={18} />
							</button>
						</div>
					</div>

					{loading ? (
						<div className="flex items-center justify-center gap-2 font-semibold text-center text-purple-300">
							<Loader2Icon className="text-purple-300 animate-spin" />
							Loading results...
						</div>
					) : results.length > 0 ? (
						<>
							<div className="flex mb-6 space-x-1 border-b border-neutral-800">
								{tabs.map((tab) => (
									<button
										key={tab.value}
										onClick={() => setActiveTab(tab.value)}
										className={cn(
											"px-4 py-2 text-sm font-medium transition-colors rounded-t-lg",
											activeTab === tab.value
												? "text-purple-300 bg-neutral-900/50 border-b-2 border-purple-500"
												: "text-neutral-400 hover:text-neutral-200"
										)}
									>
										{tab.label}
									</button>
								))}
							</div>
							{renderTabContent()}
						</>
					) : (
						<NoResultsMessage />
					)}
				</div>
			</div>
		</main>
	);
}

const ProjectCard = ({
	project,
	index,
}: { project: Project; index: number }) => {
	const [showFullDescription, setShowFullDescription] =
		useState<boolean>(false);
	const truncateDescription = (desc: string, maxLength = 160) => {
		return desc.length > maxLength
			? `${desc.substring(0, maxLength)}...`
			: desc;
	};
	return (
		<div className="relative p-4 transition-all duration-300 bg-opacity-50 border rounded-lg bg-neutral-900 backdrop-blur-lg border-neutral-700 hover:border-purple-500">
			<span className="absolute text-6xl font-black right-4 top-2 text-neutral-200/10">{index}</span>
			<h2 className="mb-1 text-2xl font-semibold text-purple-300">
				#<a
					href={project.link}
					target="_blank"
					rel="noreferrer"
					className="transition-colors hover:text-purple-400"
				>
					{project.title}
				</a>
			</h2>
			<a
				href={project.link}
				target="_blank"
				className="block mb-2 text-xs text-neutral-500 hover:text-neutral-400"
				rel="noreferrer"
			>
				Link {project.link}
			</a>
			<div className="text-sm text-neutral-300">
				<p className="mr-2">
					{showFullDescription
						? project.description
						: truncateDescription(project.description)}
				</p>
				<button
					type="button"
					className="text-neutral-500"
					onClick={() => {
						setShowFullDescription((prev) => !prev);
					}}
				>
					{showFullDescription ? "Read less" : "Read more"}
				</button>
			</div>

			{project.twitter && (
				<a
					href={project.twitter}
					target="_blank"
					className="block mt-2 text-xs text-neutral-500 hover:text-neutral-400"
					rel="noreferrer"
				>
					Link {project.twitter}
				</a>
			)}
		</div>
	);
};
