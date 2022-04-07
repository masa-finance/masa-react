import React, { useState } from 'react';
import { Comment, Tooltip, Avatar, Card } from 'antd';
import { MethodParameters } from '../method-parameters';
import { MethodMetadata } from '../../rest';
import { ResponseValues } from '../response-values';
import { CustomParameters } from '../custom-parameters';

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
  const [showCustomParameters, setShowCustomParameters] = useState(false);
  const { getData, data } = useMethod();

  const handleCall = async () => {
    const dt = await getData(customParameters);
    console.log(dt);
  };
  const [customParameters, setCustomParameters] = useState(()=>{
    const customParameterObject={};
    // @ts-ignore
    parameters.forEach((parameter)=> customParameterObject[parameter['name']]=parameter['default']);
    return customParameterObject}
    )

  const onValueChange = (key: string, value: string) => {
    setCustomParameters({...customParameters, [key]: value})
  }

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
    <span
      key="comment-basic-reply-to"
      onClick={() => setShowCustomParameters(!showCustomParameters)}
    >
      Set custom parameters
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
      {showParameters && <MethodParameters data={parameters}/>}
      {data && <ResponseValues data={data}/>}
      {/* @ts-ignore */}
      {showCustomParameters && <CustomParameters data={customParameters} onValueChange={onValueChange}/>}
    </Card>
  );
};
