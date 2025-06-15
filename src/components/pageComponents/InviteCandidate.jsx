import React, {  useContext, useEffect } from "react";
import { Card, Typography, Row, Col, Tag, Button } from "antd";
import { ArrowLeftOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import DataContext from "../../context/DataContext";


const { Title, Text } = Typography;

const InviteCandidate = () => {
  const { jobData, setCandidates } = useContext(DataContext);
  const navigate = useNavigate();
   const { id } = useParams(); 


  // Find the specific job based on ID from the URL
  const job = jobData.find((item) => item.id === Number(id));
  

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Back to jobs */}
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: "1rem" }}
      >
        Back to Jobs
      </Button>

      {/* Job card */}
      <Card variant="outlined" className="shadow-sm">
        <Title level={4} className="mb-2">
          {job.title}
        </Title>
        <Text strong>{job.company}</Text>
        <div className="flex items-center gap-2 text-gray-600 mt-1">
          <EnvironmentOutlined />
          <span>{job.location}</span>
        </div>
        <div className="text-gray-600 mt-2">{job.mode}</div>
        <div className="text-gray-700 font-medium mt-1">
          Salary (per Annum): <Text strong>{job.salary}</Text>
        </div>

        {/* Meta info boxes */}
        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} sm={12} md={8}>
            <Card size="small" variant="outlined">
              <Text strong>Job ID</Text>
              <br />
              {job.id}
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card size="small" variant="outlined">
              <Text strong>Notice Period</Text>
              <br />
              {job.noticePeriod}
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card size="small" variant="outlined">
              <Text strong>No of Openings</Text>
              <br />
              {job.openings}
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card size="small" variant="outlined">
              <Text strong>Posted On</Text>
              <br />
              {job.postedOn}
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card size="small" variant="outlined">
              <Text strong style={{ color: "red" }}>Deadline</Text>
              <br />
              {job.deadline}
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card size="small" variant="outlined">
              <Text strong>Experience</Text>
              <br />
              {job.experience}
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card size="small" variant="outlined">
              <Text strong>Status</Text>
              <br />
              <Tag color="green">{job.status}</Tag>
            </Card>
          </Col>
        </Row>

        {/* Additional sections */}
        <div className="mt-6">
          <Title level={5}>Job Description</Title>
          <Text>{job.description}</Text>

          <Title level={5} className="mt-4">Job Qualification</Title>
          <Text>{job.qualification}</Text>

          <Title level={5} className="mt-4">Responsibilities</Title>
          <Text>{job.responsibilities}</Text>

          <Title level={5} className="mt-4">Skills</Title>
          <Text>{job.skills}</Text>
        </div>
      </Card>
    </div>
  );
};

export default InviteCandidate;
