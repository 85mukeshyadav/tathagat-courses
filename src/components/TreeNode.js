import clsx from "clsx";
import React, { useState } from "react";

const Tree = ({
	data = [],
	setCurrentIndex,
	currentIndex,
	setCurrentQuestion,
	currentQuestion,
	setViewSection,
}) => {
	const [openNodeIndex, setOpenNodeIndex] = useState(null);

	const toggleNodeVisibility = (index) => {
		setOpenNodeIndex(openNodeIndex === index ? null : index);
	};

	return (
		<div>
			<ul>
				{data.map((tree, index) => (
					<TreeNode
						key={index}
						node={tree}
						index={index}
						currentIndex={currentIndex}
						setCurrentIndex={setCurrentIndex}
						currentQuestion={currentQuestion}
						setCurrentQuestion={setCurrentQuestion}
						setViewSection={setViewSection}
						isOpen={index === openNodeIndex}
						toggleNodeVisibility={toggleNodeVisibility}
					/>
				))}
			</ul>
		</div>
	);
};

const TreeNode = ({
	node,
	index,
	currentIndex,
	setCurrentIndex,
	currentQuestion,
	setCurrentQuestion,
	setViewSection,
	isOpen,
	toggleNodeVisibility,
}) => {
	const [childVisible, setChildVisibility] = useState(isOpen);

	const hasChild = node.children ? true : false;

	const handleNodeClick = () => {
		setChildVisibility(!childVisible);
		toggleNodeVisibility(index);
	};

	return (
		<>
			<li className="p-2">
				<div className="d-flex" onClick={handleNodeClick}>
					<div>
						<div className="col flex d-tree-head">
							{hasChild && (
								<div className="flex flex-row items-center">
									<i
										className={clsx(
											"fa fa-caret-right mr-2",
											hasChild && childVisible && "transform rotate-90"
										)}
									/>
									{hasChild && (
										<div className="text-gray-800 font-semibold p-2 bg-blue-500/10 rounded-md hover:bg-blue-500/20 transition flex flex-row items-center">
											{node.name}
											<span className="text-gray-500 text-sm ml-1">
												({node.children.length})
											</span>
										</div>
									)}
								</div>
							)}
							{!hasChild && (
								<div
									className="flex flex-row w-full"
									onClick={() => {
										setCurrentIndex(index);
										setCurrentQuestion(node);
										setViewSection(false);
									}}
								>
									<div
										className={clsx(
											"font-medium text-sm ml-2 flex text-left p-2 hover:bg-gray-50 transition",
											index == currentIndex &&
												currentQuestion == node &&
												"bg-gray-100"
										)}
									>
										{node.questionType == "paragraph" ? (
											<div className="flex flex-row" style={{ height: "100%" }}>
												<p className="w-8 mr-2 text-gray-900">Q.{index + 1}</p>
												<p
													className="text-jusitfy"
													dangerouslySetInnerHTML={{
														__html:
															node.paragraph.length > 80
																? node.paragraph.slice(0, 80).concat("...")
																: node.paragraph,
													}}
												/>
											</div>
										) : (
											<div className="flex flex-row" style={{ height: "100%" }}>
												<p className="w-8 mr-2 text-gray-900">Q.{index + 1}</p>
												<p
													dangerouslySetInnerHTML={{
														__html:
															node.question.length > 80
																? node.question.slice(0, 80).concat("...")
																: node.question,
													}}
												/>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{hasChild && childVisible && (
					<div className="d-tree-content">
						<ul className="d-flex d-tree-container flex-column">
							<Tree
								data={node.children}
								index={index}
								currentIndex={currentIndex}
								setCurrentIndex={setCurrentIndex}
								currentQuestion={currentQuestion}
								setCurrentQuestion={setCurrentQuestion}
								setViewSection={setViewSection}
							/>
						</ul>
					</div>
				)}
			</li>
		</>
	);
};

export default TreeNode;
