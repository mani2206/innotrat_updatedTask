import React, { useState, useContext, useEffect } from "react";
import {
  Card,
  List,
  Checkbox,
  Button,
  Typography,
  Space,
  Collapse,
  Dropdown,
  Input,
  Modal,
  Spin,
  Table,
  Tag
} from "antd";
import {
  CaretRightOutlined,
  UserOutlined,
  FileTextOutlined,
  SendOutlined,
  EllipsisOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DataContext from "../../context/DataContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const { Text, Title } = Typography;
const { Search } = Input;

const JobOpportunities = () => {
  const { jobData, setCandidates } = useContext(DataContext);
  const [selectedJobIds, setSelectedJobIds] = useState([]);
  const [activePanels, setActivePanels] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [openJob, setOpenJob] = useState(null);
  const [openCandidate, setOpenCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [invitingJob, setInvitingJob] = useState(null);
  const [sendInviteModalOpen, setSendInviteModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Mock data for the send invite modal
  const inviteScheduleData = [
    {
      key: "1",
      sno: 1,
      dateTime: "2023-06-20 10:00 AM",
      status: "Pending",
    },
    {
      key: "2",
      sno: 2,
      dateTime: "2023-06-21 02:30 PM",
      status: "Pending",
    },
    {
      key: "3",
      sno: 3,
      dateTime: "2023-06-22 11:15 AM",
      status: "Pending",
    },
  ];

  const toggleJobSelection = (jobId) => {
    setSelectedJobIds((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handlePanelChange = (keys) => {
    setActivePanels(Array.isArray(keys) ? keys : [keys]);
  };

  const handleTogglePanel = (panelKey) => {
    setActivePanels((prev) =>
      prev.includes(panelKey)
        ? prev.filter((key) => key !== panelKey)
        : [...prev, panelKey]
    );
  };

  const filteredJobs = jobData.filter((job) =>
    job.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const chartData = filteredJobs.map((job) => ({
    name: job.title.length > 20 ? job.title.slice(0, 17) + "..." : job.title,
    candidates: job.candidates.length,
  }));

  const getJobPanels = () =>
    filteredJobs.map((job) => {
      const menuItems = [
        {
          key: "desc",
          icon: <FileTextOutlined />,
          label: "Description",
          onClick: (e) => {
            e.domEvent.stopPropagation();
            handleTogglePanel(`desc-${job.id}`);
          },
        },
        {
          key: "cand",
          icon: <UserOutlined />,
          label: `Candidates (${job.candidates.length})`,
          onClick: (e) => {
            e.domEvent.stopPropagation();
            handleTogglePanel(`cand-${job.id}`);
          },
        },
        {
          key: "apply",
          icon: <SendOutlined />,
          label: "Apply Now",
          onClick: (e) => {
            e.domEvent.stopPropagation();
            setOpenJob(job);
          },
        },
        {
          key: "invite",
          icon: <SendOutlined />,
          label: "Invite Candidate",
          onClick: (e) => {
            e.domEvent.stopPropagation();
            navigate(`/invite-candidate/${job.id}`);
          },
        },
      ];

      return {
        key: job.id,
        label: (
          <div className="flex justify-between items-start w-full">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={selectedJobIds.includes(job.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleJobSelection(job.id);
                }}
                className="mt-1"
              />
              <div>
                <Text strong className="text-lg">
                  {job.title}{" "}
                  <span className="ml-2 text-sm text-gray-500">
                    ({job.candidates.length} candidates)
                  </span>
                </Text>
                <div className="text-gray-500 text-sm">
                  <span>{job.location}</span> | <span>{job.salary}</span>
                </div>
              </div>
            </div>
            <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
              <Button
                icon={<EllipsisOutlined />}
                type="text"
                onClick={(e) => e.stopPropagation()}
                className="p-0"
              />
            </Dropdown>
          </div>
        ),
        children: (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button
                icon={<FileTextOutlined />}
                onClick={() => handleTogglePanel(`desc-${job.id}`)}
                type="default"
              >
                View Description
              </Button>
              <Button
                icon={<UserOutlined />}
                onClick={() => handleTogglePanel(`cand-${job.id}`)}
                type="default"
              >
                View Candidates ({job.candidates.length})
              </Button>
              <Button
                icon={<SendOutlined />}
                type="primary"
                onClick={() => setOpenJob(job)}
              >
                Apply Now
              </Button>
              <Button
                icon={<SendOutlined />}
                type="dashed"
                onClick={() => navigate(`/invite-candidate/${job.id}`)}
              >
                view Job Description
              </Button>
              <Button
                icon={<SendOutlined />}
                type="dashed"
                onClick={(e) => {
                  e.stopPropagation();
                  setInvitingJob(job);
                  setInviteModalOpen(true);
                }}
              >
                Invite Candidates
              </Button>
            </div>
            {activePanels.includes(`desc-${job.id}`) && (
              <Text>{job.description}</Text>
            )}
            {activePanels.includes(`cand-${job.id}`) && (
              <div className="overflow-x-auto">
                <List
                  size="small"
                  dataSource={job.candidates}
                  renderItem={(candidate) => (
                    <List.Item
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 min-w-[24rem]"
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <Space direction="vertical" className="flex-1 min-w-0">
                        <Text strong>{candidate.name}</Text>
                        <Text type="secondary" ellipsis>
                          Skill: {candidate.skill}
                        </Text>
                        <Text type="secondary" ellipsis>
                          Status: {candidate.status}
                        </Text>
                      </Space>
                      <Space
                        direction="vertical"
                        className="min-w-[10rem] text-right"
                      >
                        <Button
                          size="small"
                          type="link"
                          onClick={() =>
                            setOpenCandidate({ ...candidate, type: "mock" })
                          }
                        >
                          Mock: {candidate.mockInterviews}
                        </Button>
                        <Button
                          size="small"
                          type="link"
                          onClick={() =>
                            setOpenCandidate({ ...candidate, type: "job" })
                          }
                        >
                          Jobs: {candidate.jobInterviews}
                        </Button>
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            )}
          </div>
        ),
      };
    });

  return (
    <Spin
      spinning={loading}
      tip="Loading jobs..."
      indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
    >
      <Card
        title={<Title level={3}>Job Opportunities</Title>}
        className="shadow-sm max-w-7xl mx-auto p-4"
      >
        {/* Search */}
        <div className="mb-6">
          <Search
            placeholder="Search jobs..."
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            enterButton
          />
        </div>

        {/* Chart */}
        <Card size="small" className="mb-6">
          <Title level={5}>Candidates per Job (Chart)</Title>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="candidates"
                fill="#1890ff"
                animationDuration={1500}
                animationEasing="ease-out"
                barSize={30}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Collapsible job list */}
        <Collapse
          bordered={false}
          accordion
          activeKey={activePanels}
          onChange={handlePanelChange}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          items={getJobPanels()}
          className="bg-white"
        />

        {/* Apply Modal */}
        <Modal
          title="Interview Details"
          open={!!openJob}
          onCancel={() => setOpenJob(null)}
          onOk={() => {
            if (openJob) {
              setCandidates(
                openJob.candidates.map((c, index) => ({
                  id: `${openJob.id}-${index}`,
                  name: c.name,
                  skill: c.skill,
                  status: c.status,
                }))
              );
              setOpenJob(null);
              navigate("/registered-candidates");
            }
          }}
          okText="Proceed"
          cancelText="Cancel"
        >
          {openJob && (
            <>
              <p>
                <strong>Position:</strong> {openJob.title}
              </p>
              <p>
                <strong>Date:</strong> {openJob.interviewDate || "TBD"}
              </p>
              <p>
                <strong>Time:</strong> {openJob.interviewTime || "TBD"}
              </p>
              <p>
                <strong>Location:</strong> {openJob.interviewLocation || "TBD"}
              </p>
            </>
          )}
        </Modal>

        {/* Candidate Modal */}
        <Modal
          open={!!openCandidate}
          onCancel={() => setOpenCandidate(null)}
          footer={[
            <Button key="cancel" onClick={() => setOpenCandidate(null)}>
              Cancel
            </Button>,
            <Button
              key="send"
              type="primary"
              onClick={() => {
                setOpenCandidate(null);
                setSendInviteModalOpen(true);
              }}
            >
              Send Invite
            </Button>,
          ]}
          title={
            openCandidate
              ? `${openCandidate.name} - ${
                  openCandidate.type === "mock"
                    ? "Mock Interviews"
                    : "Job Interviews"
                }`
              : ""
          }
        >
          {openCandidate && (
            <div>
              <p>
                <strong>Name:</strong> {openCandidate.name}
              </p>
              <p>
                <strong>Skill:</strong> {openCandidate.skill}
              </p>
              {openCandidate.type === "mock" && (
                <p>
                  <strong>Mock Interviews Attended:</strong>{" "}
                  {openCandidate.mockInterviews}
                </p>
              )}
              {openCandidate.type === "job" && (
                <p>
                  <strong>Job Interviews Attended:</strong>{" "}
                  {openCandidate.jobInterviews}
                </p>
              )}
            </div>
          )}
        </Modal>

        {/* Send Invite Modal */}
        <Modal
          title="Invitation Schedule"
          open={sendInviteModalOpen}
          onCancel={() => setSendInviteModalOpen(false)}
          footer={[
            <Button key="back" onClick={() => setSendInviteModalOpen(false)}>
              Close
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => setSendInviteModalOpen(false)}
            >
              Confirm
            </Button>,
          ]}
          width={700}
        >
          <Table
            dataSource={inviteScheduleData}
            columns={[
              {
                title: "S.No",
                dataIndex: "sno",
                key: "sno",
              },
              {
                title: "Date and Time",
                dataIndex: "dateTime",
                key: "dateTime",
              },
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (status) => (
                  <span
                    style={{
                      color: status === "Pending" ? "#faad14" : "#52c41a",
                    }}
                  >
                    {status}
                  </span>
                ),
              },
            ]}
            pagination={false}
          />
        </Modal>

        {/* Invite Candidates Modal */}
        <Modal
          title={`Invite Candidates - ${invitingJob?.title}`}
          open={inviteModalOpen}
          onCancel={() => {
            setInviteModalOpen(false);
            setInvitingJob(null);
          }}
          footer={[
            <Button
              key="cancel"
              onClick={() => {
                setInviteModalOpen(false);
                setInvitingJob(null);
              }}
            >
              Cancel
            </Button>,
            <Button
              key="send"
              type="primary"
              onClick={() => {
                // Show confirmation popup when Send is clicked
                Modal.confirm({
                  title: "Confirm Invitation",
                  content: (
                    <Table
                      dataSource={invitingJob?.candidates.map((c, index) => ({
                        key: index,
                        id: `${invitingJob.id}-${index}`,
                        name: c.name,
                        department: c.department || "N/A",
                        time: new Date().toLocaleString(), // Current time
                        status: "Pending", // Default status
                      }))}
                      columns={[
                        { title: "Candidate ID", dataIndex: "id", key: "id" },
                        { title: "Name", dataIndex: "name", key: "name" },
                        {
                          title: "Department",
                          dataIndex: "department",
                          key: "department",
                        },
                        { title: "Time", dataIndex: "time", key: "time" },
                        {
                          title: "Status",
                          dataIndex: "status",
                          key: "status",
                          render: (status) => (
                            <Tag
                              color={status === "Pending" ? "orange" : "green"}
                            >
                              {status}
                            </Tag>
                          ),
                        },
                      ]}
                      pagination={{ pageSize: 5 }}
                      size="small"
                    />
                  ),
                  okText: "Send Invites",
                  cancelText: "Cancel",
                  onOk() {
                    // Handle sending invites here
                    console.log("Invites sent");
                    setInviteModalOpen(false);
                    setInvitingJob(null);

                    // You can add your API call here to actually send invites
                    // After successful send, you might want to update the status
                  },
                  width: 800,
                });
              }}
            >
              Send Invites
            </Button>,
          ]}
          width={1000} // Increased width to accommodate more columns
        >
          {invitingJob && (
            <Table
              dataSource={invitingJob.candidates.map((c, index) => ({
                key: index,
                id: `${invitingJob.id}-${index}`,
                name: c.name,
                department: c.department || "N/A",
                time: new Date().toLocaleString(), // Current time
                status: "Pending", // Default status
                profileLink: c.profileLink || "#",
              }))}
              columns={[
                {
                  title: "Candidate ID",
                  dataIndex: "id",
                  key: "id",
                },
                {
                  title: "Name",
                  dataIndex: "name",
                  key: "name",
                },
                {
                  title: "Department",
                  dataIndex: "department",
                  key: "department",
                },
                {
                  title: "Time",
                  dataIndex: "time",
                  key: "time",
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  key: "status",
                  render: (status) => (
                    <Tag color={status === "Pending" ? "orange" : "green"}>
                      {status}
                    </Tag>
                  ),
                },
                {
                  title: "Profile",
                  dataIndex: "profileLink",
                  key: "profileLink",
                  render: (link) => (
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      View Profile
                    </a>
                  ),
                },
              ]}
              pagination={{ pageSize: 5 }}
            />
          )}
        </Modal>
      </Card>
    </Spin>
  );
};

export default JobOpportunities;
