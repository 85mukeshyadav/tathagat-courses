import React, { useState } from "react";
import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import Score from "../../Course/Score";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Group, Button, ScrollArea } from "@mantine/core";
import { Checkbox } from "@mantine/core";
// import hideNavContext from "../../../context/AllprojectsContext";

const Tree = ({ data = [], setNodeClick }) => {
	return (
		<div className="d-tree">
			<ul className="d-flex d-tree-container flex-column">
				{data.map((tree) => (
					<TreeNode node={tree} setNodeClick={setNodeClick} />
				))}
			</ul>
		</div>
	);
};

const TreeNode = ({ node, setNodeClick }) => {
	const [childVisible, setChildVisiblity] = useState(false);
	const [scoreOpened, scoreHooks] = useDisclosure(false);
	const [instructionsOpened, instructionsHooks] = useDisclosure(false);
	const [checked, setChecked] = useState(false);
	const navigate = useNavigate();

	const hasChild = node.children ? true : false;

	const redirectTo = (url) => {
		navigate(url);
	};

	return (
		<>
			<Modal
				opened={scoreOpened}
				onClose={scoreHooks.close}
				title="Score"
				size="100%"
				centered
				className="h-1/2"
			>
				<Score />
			</Modal>
			<Modal
				opened={instructionsOpened}
				onClose={instructionsHooks.close}
				// title="Instructions"
				size="100%"
			>
				<ScrollArea h={500}>
					{/* <p className="text-2xl font-bold text-gray-700">Test Instructions</p> */}
					<div
						className="mt-4 px-6"
						dangerouslySetInnerHTML={{ __html: node.instructions }}
					/>
				</ScrollArea>
				<Checkbox
					checked={checked}
					onChange={(event) => setChecked(event.currentTarget.checked)}
					label="I have read and understood the instructions"
				/>
				<Group position="right">
					<Button
						onClick={() => {
							localStorage.setItem("testid", node.id);
							redirectTo("/examination");
						}}
						disabled={!checked}
						className="items-center m-2 p-2 pl-4 pr-4 rounded-md font-semibold bg-blue-400 text-gray-50"
					>
						<i className="fas fa-play mr-2" />
						Begin Test
					</Button>
				</Group>
			</Modal>
			<li className="d-tree-node">
				<div className="d-flex" onClick={(e) => setChildVisiblity((v) => !v)}>
					<div>
						<div
							className="col flex justify-center d-tree-head w-max bg-blue-100 p-2 rounded-md"
							onClick={() => {
								setNodeClick({
									title: node.title,
									id: node.id,
									index: node.index,
								});
							}}
						>
							{/* <FontAwesomeIcon icon="caret-right" /> */}
							<div
								className={`d-inline mr-2 d-tree-toggler-${
									hasChild && childVisible ? "active" : ""
								}`}
							>
								<i className="fa fa-caret-right" />
							</div>
							<i className={`${node.icon} mt-1 mr-2`}> </i>
							<span>{node.label}</span>
						</div>
						{(node.title === "courseTest" ||
							node.title === "subjectTest" ||
							node.title === "chapterTest" ||
							node.title === "topicTest") && (
							<>
								{node.attempt_id ? (
									<>
										<div className="w-full mt-2">
											<button
												onClick={() => {
													localStorage.setItem("testid", node.id);
													redirectTo("/review");
												}}
												className="items-center w-32 m-2 p-2 px-4 rounded-md font-semibold bg-blue-400 text-gray-50"
											>
												<i className="fa fa-eye"></i> {"  "}
												Review
											</button>

											<button
												onClick={() => {
													localStorage.setItem("testid", node.id);
													scoreHooks.open();
												}}
												className="items-center w-32 m-2 p-2 px-4 rounded-md font-semibold bg-blue-400 text-gray-50"
											>
												<i className="fas fa-trophy"></i> {"  "}
												Score
											</button>
											<button
												onClick={() => {
													localStorage.setItem("testid", node.id);
													redirectTo("/analysis");
												}}
												className="items-center w-32 m-2 p-2 px-4 rounded-md font-semibold bg-blue-400 text-gray-50"
											>
												<i className="fas fa-chart-bar"></i> {"  "}
												Analysis
											</button>
										</div>
									</>
								) : (
									<Link
										to={node.instructions ? "" : "/examination"}
										onClickCapture={() => {
											localStorage.setItem("testid", node.id);
											node.instructions && instructionsHooks.open();
											setChecked(false);
										}}
									>
										<button className="items-center w-32 m-2 p-2 px-4 rounded-md font-semibold bg-blue-400 text-gray-50">
											<i className="fas fa-play"></i> {"  "}
											Start Test
										</button>{" "}
									</Link>
								)}
							</>
						)}
					</div>
				</div>

				{hasChild && childVisible && (
					<div className="d-tree-content">
						<ul className="d-flex d-tree-container flex-column">
							<Tree data={node.children} setNodeClick={setNodeClick} />
						</ul>
					</div>
				)}
			</li>
		</>
	);
};

export default Tree;
