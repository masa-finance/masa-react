import React, { useState } from 'react';
import { Comment, Tooltip, Avatar, Card } from 'antd';
import { MethodParameters } from '../method-parameters';
import { MethodMetadata } from '../../rest';
import { ResponseValues } from '../response-values';
import { CustomParameters } from '../custom-parameters';
import { PathParameters } from '../path-parameters';

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
  const [showPathParameters, setShowPathParameters] = useState(false);

  const [customParameters, setCustomParameters] = useState(() => {
    const customParameterObject = {};
    // @ts-ignore
    parameters.forEach(
      (parameter) =>
        (customParameterObject[parameter['name']] = parameter['default'])
    );
    return customParameterObject;
  });

  const [pathParameters, setPathParameters] = useState(() => {
    const customParameterObject = {};
    const pathParametersList = name.split(':');
    pathParametersList.shift();
    pathParametersList.forEach((pathParameter) => {
      const pathParameterClean = pathParameter.split('?');
      //@ts-ignore
      customParameterObject[pathParameterClean[0]] = '';
    });
    pathParametersList.forEach((pathParameter) => {
      const pathParameterClean = pathParameter.split('&');
      //@ts-ignore
      customParameterObject[pathParameterClean[0]] = '';
    });
    return customParameterObject;
  });
  const { getData, data } = useMethod({ pathParameters, body: customParameters });

  const handleCall = async () => {
    const dt = await getData();
    console.log(dt);
  };

  const onValueChange = (key: string, value: string) => {
    const parameter = parameters.filter(parameter => parameter['name'] = key)
    setCustomParameters({ ...customParameters, [key]: parameter[0].dataType == 'string' ? value : Number(value)});
  };

  const onValuePathChange = (key: string, value: string) => {
    setPathParameters({ ...pathParameters, [key]: value });
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
    <span
      key="comment-basic-reply-to"
      onClick={() => setShowCustomParameters(!showCustomParameters)}
    >
      Set custom parameters
    </span>,
    <span
      key="comment-basic-reply-to"
      onClick={() => setShowPathParameters(!showPathParameters)}
    >
      Set path parameters
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
      {/* @ts-ignore */}
      {showCustomParameters && (
        <CustomParameters
          data={customParameters}
          onValueChange={onValueChange}
        />
      )}
      {showPathParameters && (
        <PathParameters
          data={pathParameters}
          onValueChange={onValuePathChange}
        />
      )}
    </Card>
  );
};
