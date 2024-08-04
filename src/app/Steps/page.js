'use client'
import React, { useState } from 'react';
import { Button, message, Steps, theme, Form, Input } from 'antd';


export default function Detail() {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [evaluatorName, setEvaluatorName] = useState('');
  const [applicantCountry, setApplicantCountry] = useState('');
  const [role, setRole] = useState('');
  
  console.log(evaluatorName)

  const steps = [
    {
      title: 'Name Of Evaluator',
      content: (
        <Form layout="vertical" style={{ maxWidth: 400, margin: 'auto' }}>
          <Form.Item label="Evaluator's Name" required>
            <Input
              value={evaluatorName}
              onChange={(e) => setEvaluatorName(e.target.value)}
              placeholder="Enter name of evaluator"
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Country To Evaluate',
      content: (
        <Form layout="vertical" style={{ maxWidth: 400, margin: 'auto' }}>
          <Form.Item label="Country To Evaluate" required>
            <Input
              value={applicantCountry}
              onChange={(e) => setApplicantCountry(e.target.value)}
              placeholder="Enter name of the country"
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Role',
      content: (
        <Form layout="vertical" style={{ maxWidth: 400, margin: 'auto' }}>
          <Form.Item label="Role" required>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Enter role"
            />
          </Form.Item>
        </Form>
      ),
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const contentStyle = {
    padding: '104px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  return (
    <div style={{margin:'6rem'}}>
      <Steps current={current} items={items}  style={{fontSize:'4rem'}}/>
      <div style={contentStyle}>{steps[current].content}</div>
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={prev}>
            Previous
          </Button>
        )}
      </div>
    </div>
  );
}
