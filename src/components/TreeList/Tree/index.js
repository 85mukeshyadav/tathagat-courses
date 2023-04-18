import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import Score from "../../Course/Score";
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
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const navigate = useNavigate();

	const hasChild = node.children ? true : false;

	const setModalIsOpenToFalse = () => {
		setModalIsOpen(false);
	};

	const setModalIsOpenToTrue = () => {
		setModalIsOpen(true);
	};

	const redirectTo = (url) => {
		navigate(url);
	};

	return (
		<>
			<Modal
				isOpen={modalIsOpen}
				style={{
					content: {
						height: "29%",
						position: "absolute",
						top: "25%",
					},
				}}
				ariaHideApp={false}
			>
				<button onClick={setModalIsOpenToFalse}>x</button>
				<Score />
			</Modal>
			<li className="d-tree-node">
				<div className="d-flex" onClick={(e) => setChildVisiblity((v) => !v)}>
					{hasChild && (
						<div
							className={`d-inline d-tree-toggler ${
								childVisible ? "active" : ""
							}`}
						>
							<FontAwesomeIcon icon="caret-right" />
						</div>
					)}

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
												className="items-center w-32 m-2 p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm font-semibold bg-blue-400 text-gray-50"
											>
												<i className="fas fa-eye"></i> {"  "}
												Review
											</button>

											<button
												onClick={() => {
													localStorage.setItem("testid", node.id);
													setModalIsOpenToTrue();
												}}
												className="items-center w-32 m-2  p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm font-semibold bg-blue-400 text-gray-50"
											>
												<i className="fas fa-trophy"></i> {"  "}
												Score
											</button>
											<button
												onClick={() => {
													localStorage.setItem("testid", node.id);
													redirectTo("/analysis");
												}}
												className="items-center w-32 m-2 p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm font-semibold bg-blue-400 text-gray-50"
											>
												<i className="fas fa-chart-bar"></i> {"  "}
												Analysis
											</button>
										</div>
									</>
								) : (
									<Link
										to={`/examination`}
										onClickCapture={() =>
											localStorage.setItem("testid", node.id)
										}
									>
										<button className="items-center m-2 p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm font-semibold bg-blue-400 text-gray-50">
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
