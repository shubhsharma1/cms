import React, { useState,useEffect } from 'react';
import {  Spin } from 'antd';
import styled from 'styled-components';
import { Link,useHistory } from "react-router-dom"

import { gapi } from 'gapi-script';

import {
    Card,
    CardBody,
    Col,
    Button,
    DropdownMenu,
    DropdownToggle,
      Row,
    UncontrolledDropdown,
    Container,
    CardTitle,
    Form,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Table,
    Input, Label
} from "reactstrap"


import GoogleDriveImage from '../../assets/images/google-drive.png';
import ListDocuments from '../ListDocuments';

import { style } from './styles';

import moment from "moment"

const NewDocumentWrapper = styled.div`
  ${style}
`;

// Client ID and API key from the Developer Console
const CLIENT_ID = '1087902307093-l68ij0lcqo2b273jc046n84aiulbhsvl.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCV_Yde-S0eG46MOYghKwXc6MHr5e5ISgk';

// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPESF = 'https://www.googleapis.com/auth/drive';

const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

const FileList = () => {
    const [modal, setModal] = React.useState(false);

    // Toggle for Modal
    const toggle = () => setModal(!modal);


    const [imagemodal, setImageModal] = React.useState(false);

    // Toggle for Modal
    const imagetoggle = () => setImageModal(!imagemodal);



    const [listDocumentsVisible, setListDocumentsVisibility] = useState(false);
    const [FolderName, setFolderName] = useState('');
    const [AccessToken, setAccessToken] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isLoadingGoogleDriveApi, setIsLoadingGoogleDriveApi] = useState(false);
  const [isFetchingGoogleDriveFiles, setIsFetchingGoogleDriveFiles] = useState(false);
  const [signedInUser, setSignedInUser] = useState();
    const history = useHistory();
  // const handleChange = (file) => { };

  /**
   * Print files.
   */

    useEffect(() => {
        // Update the document title using the browser API
        handleClientLoad();
    }, []);

    const styleImg = {
            borderRadius :"3px",

    }

    const styleHead = {

        textTransform: "Uppercase"


    }

    const
        styleLogout = {

        marginLeft : "10px",



        }


    const listFiles = (searchTerm = null) => {

    setIsFetchingGoogleDriveFiles(true);
    gapi.client.drive.files
        .list({
          pageSize: 10,
          fields: 'nextPageToken, files(id, name, mimeType, modifiedTime,thumbnailLink)',
            // 'q': "mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/octet-stream'",

        })
        .then(function (response) {
          setIsFetchingGoogleDriveFiles(false);
          setListDocumentsVisibility(true);
          const res = JSON.parse(response.body);

          setDocuments(res.files);
        });
  };

  console.log(documents);


  /**
   *  Sign in the user upon button click.
   */
  const handleAuthClick = (event) => {
    gapi.auth2.getAuthInstance().signIn();
  };

  /**
   *  Called when the signed in status changes, to update the UI
   *  appropriately. After a sign-in, the API is called.
   */
  const updateSigninStatus = (isSignedIn) => {
     if (isSignedIn) {
      // // Set the signed in user

        // console.log(gapi.auth2.getAuthInstance().currentUser.le.wt);

         setAccessToken(gapi.auth2.getAuthInstance().currentUser.le.xc.access_token);


      setSignedInUser(gapi.auth2.getAuthInstance().currentUser.le.wt);
      // setIsLoadingGoogleDriveApi(false);
      // list files if user is authenticated
      listFiles();
    } else {
      // prompt user to sign in
      handleAuthClick();
    }
  };


  /**
   *  Sign out the user upon button click.
   */
  const handleSignOutClick = (event) => {
    setListDocumentsVisibility(false);
    gapi.auth2.getAuthInstance().signOut();

      history.push("/logout");

      // <Link to="/logout" className="dropdown-item">
      //     <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
      //     <span>{this.props.t("Logout")}</span>
      // </Link>



  };

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  const initClient = () => {
    setIsLoadingGoogleDriveApi(true);
    gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        .then(
            function () {
              // Listen for sign-in state changes.
              gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

              // Handle the initial sign-in state.
              updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            },
            function (error) { }
        );
  };



        const createFolder = (value) => {

            setModal(false);
            // console.log(value);
        //const access_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWUsImp0aSI6ImQ2MTEwYzAxLWMwYjUtNDUzNy1iNDZhLTI0NTk5Mjc2YjY1NiIsImlhdCI6MTU5MjU2MDk2MCwiZXhwIjoxNTkyNTY0NjE5fQ.QgFSQtFaK_Ktauadttq1Is7f9w0SUtKcL8xCmkAvGLw';

            const request = gapi.client.request({
            'path': '/drive/v2/files/',
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + AccessToken,
                'Scope' : SCOPESF,
            },
            'body':{
                "title" : value,
                "mimeType" : "application/vnd.google-apps.folder",
            }
            });

            //console.log(request);

        request.execute(function(resp) {


            // console.log(resp);
            handleClientLoad();
                // document.getElementById("info").innerHTML = "Created folder: " + resp.title;
        });

    }

  const handleClientLoad = () => {
    gapi.load('client:auth2', initClient);
  };

  const showDocuments = () => {
    setListDocumentsVisibility(true);
  };

  const onClose = () => {
    setListDocumentsVisibility(false);
  };

  return (
      <React.Fragment>
          <div>
              <Row className="mb-3">
                  <Col xl={9} sm={6}>
                      <div className="mt-1">
                          <h5 className="font-size-16 " style={styleHead}>{`${signedInUser?.Ad} (${signedInUser?.cu}) `}

                              <button
                                  style={styleLogout}
                                  type="button"
                                  onClick={handleSignOutClick}

                                  className=" btn btn-link font-size-14 text-decoration-none text-secondary border "
                              >
                                  Sign Out <i className="mdi mdi-logout-variant"></i>
                              </button>
                          </h5>
                      </div>
                  </Col>
                  <Col xl={3} sm={6}>
                          <UncontrolledDropdown>
                              <DropdownToggle
                                  className="btn btn-light dropdown-toggle w-100"
                                  color="#eff2f7"
                                  type="button"
                              >
                                  <i className="mdi mdi-plus me-1"></i> Create New
                              </DropdownToggle>
                              <DropdownMenu>
                                  <Link className="dropdown-item" to="#" onClick={toggle}   >
                                      <i className="bx bx-folder me-1"></i> Folder
                                  </Link>
                                  <Link className="dropdown-item" to="#" onClick={imagetoggle}>
                                      <i className="bx bx-file me-1"></i> File
                                  </Link>
                              </DropdownMenu>
                          </UncontrolledDropdown>

                  </Col>

                  <div style={{ display: 'block', width: 700 }}>

                      <Modal isOpen={modal} toggle={toggle}>
                          <ModalHeader
                              toggle={toggle}>Create Folder</ModalHeader>
                          <ModalBody>
                                  <div className="mb-3">
                                      <Label htmlFor="formrow-firstname-Input">Folder Name</Label>
                                      <Input
                                          type="text"
                                          name="name"
                                          onChange={(e)=>{setFolderName(e.target.value)} }
                                          className="form-control"
                                          id="formrow-firstname-Input"
                                          placeholder="Enter Folder Name"
                                      />
                                  </div>
                                     <div>
                                      <button onClick={()=>{createFolder(FolderName)} } style={{backgroundColor: "#151821"}}   className="btn btn-primary w-md">
                                          <i className="bx bx-folder me-1"></i>   Create
                                      </button>
                                  </div>

                          </ModalBody>
                          {/*<ModalFooter>*/}
                          {/*    <Button color="primary" onClick={toggle}>Okay</Button>*/}
                          {/*</ModalFooter>*/}
                      </Modal>
                  </div >


                  <div style={{ display: 'block', width: 700 }}>

                      <Modal isOpen={imagemodal} toggle={imagetoggle}>
                          <ModalHeader
                              toggle={imagetoggle}>Create Folder</ModalHeader>
                          <ModalBody>
                              <div className="mb-3">
                                  <Label htmlFor="formrow-firstname-Input">Image Name</Label>
                                  <Input
                                      type="text"
                                      name="name"
                                      onChange={(e)=>{setFolderName(e.target.value)} }
                                      className="form-control"
                                      id="formrow-firstname-Input"
                                      placeholder="Enter Folder Name"
                                  />
                              </div>
                              <div>
                                  <button onClick={()=>{createFolder(FolderName)} } style={{backgroundColor: "#151821"}}   className="btn btn-primary w-md">
                                      <i className="bx bx-folder me-1"></i>   Create
                                  </button>
                              </div>

                          </ModalBody>
                          {/*<ModalFooter>*/}
                          {/*    <Button color="primary" onClick={toggle}>Okay</Button>*/}
                          {/*</ModalFooter>*/}
                      </Modal>
                  </div >



              </Row>
          </div>
          <div>



              <Row>

                  {documents.map((myfiles, key) => (
                      <Col xl={4} sm={6} key={key}>
                          <Card className="shadow-none border">
                              <CardBody className="p-3">
                                  <div className="">
                                      <div className="float-end ms-2">
                                          <UncontrolledDropdown className="mb-2" direction="left">
                                              <DropdownToggle
                                                  color="white"
                                                  className="font-size-16 text-muted dropdown-toggle"
                                                  tag="a"
                                              >
                                                  <i className="mdi mdi-dots-horizontal"></i>
                                              </DropdownToggle>

                                              <DropdownMenu className="dropdown-menu-end">
                                                  <Link className="dropdown-item" to="#">
                                                      Open
                                                  </Link>
                                                  <Link className="dropdown-item" to="#">
                                                      Edit
                                                  </Link>
                                                  <Link className="dropdown-item" to="#">
                                                      Rename
                                                  </Link>
                                                  <div className="dropdown-divider"></div>
                                                  <Link className="dropdown-item" to="#">
                                                      Remove
                                                  </Link>
                                              </DropdownMenu>
                                          </UncontrolledDropdown>
                                      </div>
                                      <div className="avatar-sm mb-3">
                                          <div className="avatar-title bg-transparent rounded">
                                              {myfiles.mimeType !=='application/vnd.google-apps.folder' ? <img style={styleImg} alt="" src={'https://lh3.google.com/u/0/d/'+`${myfiles.id}`}  height="50px" width="50px"/>  :  <i className="bx bxs-folder font-size-24 text-warning"></i> } </div>
                                      </div>
                                      <div className="d-flex">
                                          <div className="overflow-hidden me-auto">
                                              <h5 className="font-size-14    text-truncate mb-1">
                                                  <Link to="#" className="text-body">
                                                      {myfiles.name}
                                                  </Link>
                                              </h5>
                                              <p className="text-muted text-truncate mb-0">
                                                  {moment(myfiles.modifiedTime).format('Do MMMM YYYY')}    </p>
                                          </div>
                                          {/*<div className="align-self-end ms-2">*/}
                                          {/*    <p className="text-muted mb-0">{myfiles.Gb}GB</p>*/}
                                          {/*</div>*/}
                                      </div>
                                  </div>
                              </CardBody>
                          </Card>
                      </Col>
                  ))}
              </Row>
          </div>



      </React.Fragment>

);
};

export default FileList;
