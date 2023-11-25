import { Button, Checkbox, Group, Modal, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Score from "../../Course/Score";
import "./index.css";
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
				size="100%"
			>
				<p className="text-2xl uppercase text-center font-bold text-gray-700">
					Test Instructions
				</p>
				<ScrollArea h={450}>
					<div
						className="mt-4 px-6 pb-4"
						dangerouslySetInnerHTML={{ __html: node.instructions }}
					/>
				</ScrollArea>
				<Checkbox
					className="mt-4"
					checked={checked}
					onChange={(event) => setChecked(event.currentTarget.checked)}
					label="I have read and understood the instructions"
				/>
				<Group position="right">
					<Button
						onClick={() => {
							localStorage.setItem("testid", node.id);
							window.open("/examination", "_blank");
						}}
						disabled={!checked}
						className="items-center m-2 p-2 pl-4 pr-4 rounded-md font-semibold bg-blue-400 transition text-gray-50"
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
												<i className="fa fa-eye mr-2"></i>
												Review
											</button>

											<button
												onClick={() => {
													localStorage.setItem("testid", node.id);
													scoreHooks.open();
												}}
												className="items-center w-32 m-2 p-2 px-4 rounded-md font-semibold bg-blue-400 text-gray-50"
											>
												<i className="fas fa-trophy mr-2"></i>
												Score
											</button>
											<button
												onClick={() => {
													localStorage.setItem("testid", node.id);
													navigate("/analysis", {
														state: {
															testid: node.id,
															attempt_id: node.attempt_id,
															submitted_at: node.submitted_at,
														},
													});
												}}
												className="items-center w-36 m-2 p-2 px-4 rounded-md font-semibold bg-blue-400 text-gray-50"
											>
												<i className="fas fa-chart-bar mr-2"></i>
												Analysis
											</button>
										</div>
									</>
								) : (
									<Link
										to={node.instructions ? "" : "/examination"}
										target={node.instructions ? "" : "_blank"}
										onClickCapture={() => {
											localStorage.setItem("testid", node.id);
											node.instructions && instructionsHooks.open();
											setChecked(false);
										}}
									>
										<button className="items-center w-34 m-2 p-2 px-4 rounded-md font-semibold bg-blue-400 text-gray-50">
											<i className="fas fa-play mr-2"></i>
											{node.id === localStorage.getItem("testid")
												? "Resume Test"
												: "Start Test"}
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
