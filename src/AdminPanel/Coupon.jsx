import React, { useState, useEffect, useRef } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    message,
    Upload,
    Switch,
    DatePicker,
    Popconfirm
} from "antd";

import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import {
    BellOutlined,
    TranslationOutlined,
    TruckOutlined,
    CloseCircleOutlined,
    PlusOutlined,
    MinusCircleOutlined,
    UploadOutlined
} from "@ant-design/icons";
import { baseurl } from "../helper/Helper";
import { useAuth } from "../context/auth";
import JoditEditor from "jodit-react";
import axios from "axios";
import Password from "antd/es/input/Password";
const { Option } = Select;


const Coupon = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form] = Form.useForm();
    const [auth, setAuth] = useAuth();
    const auth1 = JSON.parse(localStorage.getItem('auth'));

    const editor = useRef(null);

    const [content, setContent] = useState("")
    const [editorContent, setEditorContent] = useState("");
    const [categories, setCategoris] = useState([])
    const [image1, setImage] = useState();
    const [photo, setPhoto] = useState("");
    const [cross, setCross] = useState(true);
    const [record1, setRecord] = useState();
    const [imageTrue, setImageTrue] = useState(false);



     const handleRowClick = (record) => {
        // console.log("Clicked row data:", record);
        setRecord(record);
        setImage(record?.logo);
        setCross(true);

        // Access the clicked row's data here
        // You can now use 'record' to get the details of the clicked row
    };

    const handleCross = () => {
        setCross(false);
    };

    const config = {
        readonly: false,
        toolbar: true,
        buttons: [
            'source', '|',
            'bold', 'italic', 'underline', '|',
            'ul', 'ol', '|',
            'table', '|',
            'link', 'image', '|',
            'undo', 'redo'
        ],
        uploader: {
            insertImageAsBase64URI: false,
            url: "http://localhost:5000/upload",
            format: "json",
            method: "POST",
            filesVariableName: () => "image",
            isSuccess: (resp) => resp.imageUrl,
            getMessage: (resp) => resp.error || "Upload failed",
            process: (resp) => ({
                files: [resp.imageUrl],
                path: resp.imageUrl,
                baseurl: "",
                error: false,
                message: "OK"
            })
        }
    };



    useEffect(() => {
        fetchData();
        fetchData1();
    }, []);


    const fetchData1 = async () => {
        try {
            const res = await axios.get(baseurl + "/api/catagory/get-categories");
            // console.log("----data-----", res.data);
            setCategoris(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            const res = await axios.get(baseurl + "/api/coupon/getAllCoupon");

            console.log("----data-----", res.data);
            setData(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingCategory(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingCategory(record);
        setImageTrue(true);

        // const jobDescription = record?.description1?.split('\n')
         const jobDescription = record?.description1?.join('\n')
        // console.log(record.email);
        form.setFieldsValue({
            title: record.title,
            slug: record?.slug,
            code: record?.code,
            website: record?.website,
            discount: record?.discount,
             category: record?.category?._id,
             description1:jobDescription


            // dob:record.dateOfBirth,
        });
        setIsModalOpen(true);
    };


    const uploadImage = async (file) => {
        // console.log(file);
        const formData = new FormData();
        formData.append("image", file.file);
        // console.log(file.file.name);

        try {
            const response = await axios.post(
                `${baseurl}/api/catagory/uploadImage`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response) {
                message.success("Image uploaded successfully!");
                setImage(response.data.imageUrl);
                toast.success("image uploaded successfully", { position: "bottom-right" });
            }

            return response.data.imageUrl; // Assuming the API returns the image URL in the 'url' field
        } catch (error) {
            message.error("Error uploading image. Please try again later.");
            console.error("Image upload error:", error);
            return null;
        }
    };

    const handleStatusToggle = async (record) => {
        try {
            const response = await axios.patch(
                `${baseurl}/api/coupon/toggled/${record?._id}`
            );
            // console.log(response);

            if (response) {
                message.success("Status updated succesfully");
                fetchData();
            }
        } catch (error) {
            console.log(error);
        }
    };


    const handleDelete = async (record) => {
        try {
            const response = await axios.delete(`${baseurl}/api/coupon/delete/${record}`)
            if (response) {
                message.success("Status updated succesfully");
                fetchData();
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handlePost = async (values) => {

        const jobDescription = values?.description1?.split('\n')
        const postData = {
           title: values.title,
            slug: values?.slug,
            code: values?.code,
            website: values?.website,
            discount: values?.discount,
             category: values?.category,
             description1:jobDescription,
             logo: image1,
        };

        try {
            const response = await axios.post(
                baseurl + "/api/coupon/create",
                postData
            );
            // console.log(response.data);

            if (response.data) {
                setIsModalOpen(false);
                message.success("User created successfully!");
                fetchData();
                                setPhoto("");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePut = async (values) => {
         const jobDescription = values?.description1?.split('\n')
        const postData = {
            title: values.title,
            slug: values?.slug,
            code: values?.code,
            website: values?.website,
            discount: values?.discount,
             category: values?.category,
             description1:jobDescription,
            logo: imageTrue ? image1 : values.logo,
        };

        try {
            const response = await axios.put(
                `${baseurl}/api/coupon/update/${editingCategory?._id}`,
                postData
            );
            // console.log(response.data);

            if (response.data) {
                setIsModalOpen(false);
                fetchData();
                message.success("User update successfully!");
                form.resetFields();
                                setPhoto("");
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleSubmit = async (values) => {
        if (editingCategory) {
            await handlePut(values);
        } else {
            await handlePost(values);
        }
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "title",
            key: "name",
        },
        
          {
      title: "Categories",
      dataIndex: ['category', 'name'],
      key: "name",
    },

        {
            title: "Status",
            key: "status",
            render: (_, record) => (
                <Switch
                    checked={record.status === "Active"}
                    onChange={() => handleStatusToggle(record)}
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                />
            ),
        },

        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button onClick={() => handleEdit(record)}>Update</Button>
                </>
            ),
        },

        {
            title: "Delete",
            render: (_, record) => (
                <>

                    <Popconfirm
                        title="Are you sure you want to delete this Coupon?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>
                            Delete
                        </Button>
                    </Popconfirm>

                </>
            ),
        }
    ];


    const columns1 = [
        {
            title: "Name",
            dataIndex: "title",
            key: "name",
        },
        // {
        //     title: "Title",
        //     dataIndex: "title",
        //     key: "title",
        // },

        // {
        //     title: "Description",
        //     dataIndex: "para",
        //     key: "para",
        // },


        // specialization



        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button onClick={() => handleEdit(record)}>Update</Button>
                </>
            ),
        },
    ];
    return (
        <div>
            <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
                Add Coupon
            </Button>
            {
                auth1?.user?.role === 'superAdmin' ? (<><Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    rowKey={(record) => record._id}
                    onRow={(record) => ({
                        onClick: () => {
                            handleRowClick(record); // Trigger the click handler
                        },
                    })}


                // rowKey="_id"
                /></>) : (<>
                    <Table
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        rowKey={(record) => record._id}
                        onRow={(record) => ({
                        onClick: () => {
                            handleRowClick(record); // Trigger the click handler
                        },
                    })}


                    // rowKey="_id"
                    />
                </>)
            }

            <Modal
                title={editingCategory ? "Edit Coupon" : "Add Coupon"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: "Please input Title!" }]}
                    >
                        <Input placeholder="Enter Title" />
                    </Form.Item>



                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                    >
                        <Select placeholder="Select a category" loading={loading}>
                            {categories.map((cat) => (
                                <Option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>


                    <Form.Item
                        name="slug"
                        label="Category Slug"
                        rules={[{ required: true, message: "Please input slug!" }]}
                    >
                        <Input placeholder="Enter Coupon Slug" />
                    </Form.Item>

                    <Form.Item
                        name="code"
                        label="Coupon Code"
                        // rules={[{ required: true, message: "Please input code!" }]}
                    >
                        <Input placeholder="Enter Coupon Code" />
                    </Form.Item>


                    <Form.Item
                        name="website"
                        label="Coupon Website Link"
                        rules={[{ required: true, message: "Please input website link!" }]}
                    >
                        <Input placeholder="Enter Coupon Websit Link" />
                    </Form.Item>

                    <Form.Item
                        name="discount"
                        label="Coupon discount"
                        rules={[{ required: true, message: "Please input discount" }]}
                    >
                        <Input placeholder="Enter Coupon discount" />
                    </Form.Item>

                    <Form.Item
                        name="description1"
                        label="Coupon Description"
                        rules={[{ required: true, message: "Please input coupon description!" }]}
                    >
                        <Input.TextArea
                            placeholder="Enter coupon description in new line"
                            autoSize={{ minRows: 6, maxRows: 6 }}
                        />
                    </Form.Item>



                    
                    {editingCategory ? (
                        <>
                            {cross ? (
                                <>
                                    <CloseCircleOutlined
                                        style={{ width: "30px" }}
                                        onClick={handleCross}
                                    />

                                    {
                                        record1?.logo?.includes("res") ? (
                                            <img
                                                src={record1.logo}
                                                alt=""
                                                style={{ width: "100px", height: "100px" }}
                                            />
                                        ) : (
                                            <img
                                                src={`${baseurl}${record1.logo}`}
                                                alt=""
                                                style={{ width: "100px", height: "100px" }}
                                            />
                                        )
                                    }


                                </>
                            ) : (
                                <>
                                    <Form.Item
                                        label="Photo"
                                        name="photo"
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please upload the driver's photo!",
                                            },
                                        ]}
                                    >
                                        <Upload
                                            listType="picture"
                                            beforeUpload={() => false}
                                            onChange={uploadImage}
                                            showUploadList={false}
                                            customRequest={({ file, onSuccess }) => {
                                                setTimeout(() => {
                                                    onSuccess("ok");
                                                }, 0);
                                            }}
                                        >
                                            <Button icon={<UploadOutlined />}>Upload Photo</Button>
                                        </Upload>
                                    </Form.Item>
                                    {photo && (
                                        <div>
                                            <img
                                                src={URL.createObjectURL(photo)}
                                                alt="Uploaded"
                                                height="100px"
                                                width="100px"
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <Form.Item
                                label="Photo"
                                name="photo"
                                onChange={(e) => setPhoto(e.target.files[0])}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please upload the driver's photo!",
                                    },
                                ]}
                            >
                                <Upload
                                    listType="picture"
                                    beforeUpload={() => false}
                                    onChange={uploadImage}
                                    showUploadList={false}
                                    customRequest={({ file, onSuccess }) => {
                                        setTimeout(() => {
                                            onSuccess("ok");
                                        }, 0);
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>Upload Photo</Button>
                                </Upload>
                            </Form.Item>
                            {photo && (
                                <div>
                                    <img
                                        src={URL.createObjectURL(photo)}
                                        alt="Uploaded"
                                        height="100px"
                                        width="100px"
                                    />
                                </div>
                            )}
                        </>
                    )}




            


                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingCategory ? "Update" : "Submit"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

                  <ToastContainer position="top-right" autoClose={3000} />

        </div>
    );
};

export default Coupon;
