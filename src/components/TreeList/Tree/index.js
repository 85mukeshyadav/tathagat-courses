import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import "./index.css";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Score from "../../Course/Score";
import hideNavContext from "../../../context/AllprojectsContext";


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    height: 'auto'
  },
};


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
  const navigate = useNavigate()

  const hasChild = node.children ? true : false;


  const setModalIsOpenToFalse = () => {
    setModalIsOpen(false)
  }

  const setModalIsOpenToTrue = () => {
    setModalIsOpen(true)
  }

  const redirectTo = (url) => {
    navigate(url);
  }

  return (
    <>
      <Modal isOpen={modalIsOpen} style={customStyles} ariaHideApp={false}>
        <button onClick={setModalIsOpenToFalse}>x</button>
        <Score />
      </Modal>
      <li className="d-tree-node border-0">
        <div className="d-flex" onClick={(e) => setChildVisiblity((v) => !v)}>
          {hasChild && (
            <div
              className={`d-inline d-tree-toggler ${childVisible ? "active" : ""
                }`}
            >
              {/* <FontAwesomeIcon icon="caret-right" /> */}
            </div>
          )}

          <div>
            <div className="col d-tree-head" onClick={() => {
              setNodeClick({ title: node.title, id: node.id, index: node.index })
            }}>
              <i className={`mr-1 ${node.icon}`}> </i>
              <span>  {node.label}</span>
            </div>
            {
              (node.title == "courseTest" || node.title == "subjectTest" || node.title == "chapterTest" || node.title == "topicTest" ?
                <>
                  {(node.attempt_id) ?
                    <>
                      <div>
                          <button  onClick={() => { localStorage.setItem('testid', node.id); redirectTo('/review'); }} className="items-center border-2  p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm font-semibold bg-blue-400 text-gray-50">Review</button>

                        <button onClick={() => { localStorage.setItem('testid', node.id); setModalIsOpenToTrue(); }} className="items-center border-2  p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm font-semibold bg-blue-400 text-gray-50">Score</button>
                        <button onClick={() => { localStorage.setItem('testid', node.id); redirectTo('/analysis'); }} className="items-center border-2  p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm font-semibold bg-blue-400 text-gray-50">Analysis</button>
                      </div>


                    </>
                    :
                    <Link to={`/examination`} onClickCapture={() => localStorage.setItem('testid', node.id)} >
                      <button className="items-center border-2  p-1 pl-4 pr-4 disabled:cursor-not-allowed rounded-sm font-semibold bg-blue-400 text-gray-50">Start Test</button> </Link>}
                </> : ''
              )
            }
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