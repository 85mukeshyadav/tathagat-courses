import React, { useState } from "react";
import Tree from "./Tree/index";
// import ExternalInfo from "components/ExternalInfo";

// const treeData = [
//   {
//     key: "0",
//     label: "Documents",
//     icon: "fa fa-folder",
//     title: "Documents Folder",
//     children: [
//       {
//         key: "0-0",
//         label: "Document 1-1",
//         icon: "fa fa-folder",
//         title: "Documents Folder",
//         children: [
//           {
//             key: "0-1-1",
//             label: "Document-0-1.doc",
//             icon: "fa fa-file",
//             title: "Documents Folder",
//           },
//           {
//             key: "0-1-2",
//             label: "Document-0-2.doc",
//             icon: "fa fa-file",
//             title: "Documents Folder",
//           },
//           {
//             key: "0-1-3",
//             label: "Document-0-3.doc",
//             icon: "fa fa-file",
//             title: "Documents Folder",
//           },
//           {
//             key: "0-1-4",
//             label: "Document-0-4.doc",
//             icon: "fa fa-file",
//             title: "Documents Folder",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     key: "1",
//     label: "Desktop",
//     icon: "fa fa-desktop",
//     title: "Desktop Folder",
//     children: [
//       {
//         key: "1-0",
//         label: "document1.doc",
//         icon: "fa fa-file",
//         title: "Documents Folder",
//       },
//       {
//         key: "0-0",
//         label: "documennt-2.doc",
//         icon: "fa fa-file",
//         title: "Documents Folder",
//       },
//     ],
//   },
//   {
//     key: "2",
//     label: "Downloads",
//     icon: "fa fa-download",
//     title: "Downloads Folder",
//     children: [],
//   },
// ];

const TreeList = (props) => {

    let rawTreeData = props?.treeData || [];
    let subData = props?.subData || [];
    let chapData = props?.chapData || [];
    let treeData = [];
    let count = 0; 
    // if (!chapData.length && subData.length) {

    //     subData.map((data, i) => {
    //         if (!data.topicId && !data.chapterChapterId && data.subjectId) {
    //             let newJ = {
    //                 key: indexedDB,
    //                 label: data.TestTitle,
    //                 icon: "fa fa-address-book",
    //                 title: "subjectTest",
    //                 id: data.Test_Id,
    //                 attempt_id: data.attempt_id,
    //                 index: i,
    //                 children: []
    //             }
    //             treeData.push(newJ);
    //         }

    //         if (!data.topicId && data.chapterChapterId && data.subjectId) {
    //             let newJ = {
    //                 key: i,
    //                 label: data.chapterName,
    //                 icon: "fa fa-address-card",
    //                 title: "subChapter",
    //                 id: data.chapterChapterId,
    //                 attempt_id: '',
    //                 index: i,
    //                 children: []
    //             }
    //             treeData.push(newJ);
    //             treeData[i].children.push({
    //                 key: i,
    //                 label: data.TestTitle,
    //                 icon: "fa fa-graduation-cap",
    //                 title: "chapterTest",
    //                 id: data.Test_Id,
    //                 attempt_id: data.attempt_id,
    //                 index: i,
    //                 children: []
    //             })
    //         }

    //         if (data.topicId && data.chapterChapterId && data.subjectId) {
    //             let newJ = {
    //                 key: i,
    //                 label: data.chapterName,
    //                 icon: "fa fa-address-book",
    //                 title: "subChapter",
    //                 id: data.chapterChapterId,
    //                 attempt_id: '',
    //                 index: i,
    //                 children: []
    //             }
    //             treeData.push(newJ);
    //             treeData[i].children.push({
    //                 key: i,
    //                 label: data.topicName,
    //                 icon: "fa fa fa-address-card-o",
    //                 title: "subTopic",
    //                 id: data.topicId,
    //                 attempt_id: '',
    //                 index: i,
    //                 children: []
    //             })

    //             treeData[i].children[0].children.push({
    //                 key: i,
    //                 label: data.TestTitle,
    //                 icon: "fa fa-graduation-cap",
    //                 title: "topicTest",
    //                 id: data.Test_Id,
    //                 attempt_id: data.attempt_id,
    //                 index: i,
    //                 children: []
    //             })

    //         }
    //     })
    // }

    if (chapData.length) {
        let cou = 0;
        chapData.map((data, i) => {
            if (data.chapterChapterId) {
                let newJ = {
                    key: cou,
                    label: data.chapterName,
                    icon: "fa fa-address-card",
                    title: "subChapter",
                    id: data.chapterChapterId,
                    attempt_id: '',
                    index: cou,
                    children: []
                }
                treeData.push(newJ);

                if (data.topicData.length > 0) {
                    data.topicData.map((d, ind) => {
                        if (d.topicId) {
                            newJ['children'].push(
                                {
                                    key: ind,
                                    label: d.topicName,
                                    icon: "fa fa fa-address-card-o",
                                    title: "subTopic",
                                    id: d.topicId,
                                    attempt_id: '',
                                    index: ind,
                                    children: []
                                }
                            )

                            d.testData.map((e, v) => {
                                console.log(cou, ind)
                                treeData[cou].children[ind].children.push({
                                    key: v,
                                    label: e.TestTitle,
                                    icon: "fa fa-graduation-cap",
                                    title: "topicTest",
                                    id: e.Test_Id,
                                    attempt_id: e.attempt_id,
                                    index: v,
                                    children: []
                                })
                            })
                        }
                    })
                }

                data?.testData.map((e, v) => {
                    if (e.examLevel == 3) {
                        let newJl = {
                            key: cou,
                            label: e.TestTitle,
                            icon: "fa fa-graduation-cap",
                            title: "chapterTest",
                            attempt_id: e.attempt_id,
                            id: e.Test_Id,
                            index: cou,
                            children: []
                        }
                        newJ['children'].push(newJl);
                        // cou = cou+1;
                    }

                })
                cou = cou + 1;
            } else {
                data.testData.map((e,b)=>{
                    let newJ = {
                        key: cou,
                        label: e.TestTitle,
                        icon: "fa fa-graduation-cap",
                        title: "subjectTest",
                        attempt_id: e.attempt_id,
                        id: e.Test_Id,
                        index: cou,
                        children: []
                    }
                    treeData.push(newJ);
                    cou = cou + 1;
                });
                
            }

        })
    }

    rawTreeData.courseList && rawTreeData.courseList.map((res, i)=>{
        let newJ = {
            key: count,
            label: res.courseName,
            icon: "fa fa-address-book",
            title: "course",
            id: res.courseId,
            attempt_id: '',
            index: i,
            children: []
        }
        treeData.push(newJ);
        count = count + 1;
    })

    rawTreeData.courseTest && rawTreeData.courseTest.map((res, i)=>{
        let newJ = {
            key: count,
            label: res.TestTitle,
            icon: "fa fa-graduation-cap",
            title: "courseTest",
            attempt_id: res.attempt_id,
            id: res.TestId,
            index: i,
            children: []
        }
        treeData.push(newJ);
        count = count + 1;
    })

    let subCount = 0;

    rawTreeData.subjectList && rawTreeData.subjectList.map((res,i)=>{
        let newJ = {
            key: subCount,
            label: res.subjectName,
            icon: "fa-solid fa-chevron-right",
            title: "subject",
            attempt_id: '',
            id: res.Id,
            index: i,
            children: []
        }
        treeData[rawTreeData.index['courseIndex']].children.push(newJ);
        subCount = subCount + 1;
    });

    rawTreeData.subjectTest && rawTreeData.subjectTest.map((res,i)=>{
        let newJ = {
            key: subCount,
            label: res.TestTitle,
            icon: "fa fa-graduation-cap",
            title: "subjectTest",
            attempt_id: res.attempt_id,
            id: res.TestId,
            index: i,
            children: []
        }
        treeData[rawTreeData.index['courseIndex']].children.push(newJ);
        subCount = subCount + 1;
    });

    let chpCount = 0;
    rawTreeData.chapterList && rawTreeData.chapterList.map((res,i)=>{
        let newJ = {
            key: chpCount,
            label: res.chapterName,
            icon: "fa fa-address-card",
            title: "chapter",
            id: res.chapterId,
            attempt_id: '',
            index: i,
            children: []
        }
        treeData[rawTreeData.index['courseIndex']].children[rawTreeData.index['subjectIndex']].children.push(newJ);
        chpCount = chpCount + 1;
    });

    rawTreeData.subjectTest && rawTreeData.subjectTest.map((res,i)=>{
        let newJ = {
            key: chpCount,
            label: res.TestTitle,
            icon: "fa fa-graduation-cap",
            title: "chapterTest",
            attempt_id: res.attempt_id,
            id: res.TestId,
            index: i,
            children: []
        }
        treeData[rawTreeData.index['courseIndex']].children[rawTreeData.index['subjectIndex']].children.push(newJ);
        chpCount = chpCount + 1;
    });

    let topicCount = 0;
    rawTreeData.topicList && rawTreeData.topicList.map((res,i)=>{
        let newJ = {
            key: topicCount,
            label: res.topicName,
            icon: "fa fa fa-address-card-o",
            title: "topic",
            attempt_id: '',
            id: res.Id,
            index: i,
            children: []
        }
        treeData[rawTreeData.index['courseIndex']].children[rawTreeData.index['subjectIndex']].children[rawTreeData.index['chapterIndex']].children.push(newJ);
        topicCount = topicCount + 1;
    });

    rawTreeData.topicTest && rawTreeData.topicTest.map((res,i)=>{
        let newJ = {
            key: topicCount,
            label: res.TestTitle,
            icon: "fa fa-graduation-cap",
            title: "topicTest",
            attempt_id: res.attempt_id,
            id: res.Test_Id,
            index: i,
            children: []
        }
        treeData[rawTreeData.index['courseIndex']].children[rawTreeData.index['subjectIndex']].children[rawTreeData.index['chapterIndex']].children[rawTreeData.index['topicIndex']].children.push(newJ);
        topicCount = topicCount + 1;
    });

     


  return (
    <>
      {/* <Header title="Tree Data Visualization" /> */}
      {/* <ExternalInfo page="treeList" /> */}

      <div className="row">
        <div className="col text-center">
          <p className="mt-3">
            <div className="row mt-3 d-flex justify-content-center">
              <div className="col-lg-8 text-left text-dark">
                <Tree data={treeData} setNodeClick={props.setNodeClick}/>
              </div>
            </div>
          </p>
        </div>
      </div>
    </>
  );
};

export default TreeList;