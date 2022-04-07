import React, { useState } from 'react';
import { Comment, Tooltip, Avatar, Card, Button } from 'antd';
import { MethodParameters } from '../method-parameters';
import { MethodMetadata } from '../../rest';
import { ResponseValues } from '../response-values';

export const RestMethod = ({
  author,
  authorPicture,
  description,
  name,
  method,
  parameters,
  useMethod,
}: MethodMetadata & { useMethod: any }) => {
  const [showParameters, setShowParameters] = useState(false);
  const { getData, data } = useMethod();

  const handleCall = async () => {
    const call = await getData();
    console.log(call)
  };

  const actions = [
    <span
      key="comment-basic-reply-to"
      onClick={() => setShowParameters(!showParameters)}
    >
      Toggle parameters
    </span>,
    <span key="comment-basic-reply-to" onClick={handleCall}>
      Run
    </span>,
  ];

  return (
    <Card style={{ margin: '8px 0' }}>
      <Comment
        actions={actions}
        author={<a>{name}</a>}
        avatar={
          <Tooltip title={'Author Name'}>
            <Avatar
              src={
                authorPicture
                  ? authorPicture
                  : 'https://joeschmoe.io/api/v1/random'
              }
              alt={author}
            />
          </Tooltip>
        }
        content={<p>{description}</p>}
        datetime={
          <Tooltip title={'test'}>
            <span>{method}</span>
          </Tooltip>
        }
      />
      {/* @ts-ignore */}
      {showParameters && <MethodParameters data={parameters} />}
      {data && <ResponseValues data={data} />}
    </Card>
  );
};
