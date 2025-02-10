import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Flex, message, Row, Select, Switch, Table, Tag, Transfer } from 'antd';
import type { GetProp, TableColumnsType, TableProps, TransferProps } from 'antd';
import TableTransfer from './TableTransfer';
import migrationStore from '../../mobx/MigrationStore';
import { observer } from 'mobx-react';
import { FaRegSave } from "react-icons/fa";
import { FcRefresh } from "react-icons/fc";
type TransferItem = GetProp<TransferProps, 'dataSource'>[number];
type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];

interface TableTransferProps extends TransferProps<TransferItem> {
    dataSource: any[];
    leftColumns: TableColumnsType<any>;
    rightColumns: TableColumnsType<any>;
  }


const filterOption = (input: string, item: any) =>
  item.name?.includes(input) || item.program?.includes(input);
const Migration:React.FC = observer(()=>{
  const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([]);
  const [disabled, setDisabled] = useState(true);

  const onChange: TableTransferProps['onChange'] = (nextTargetKeys) => {
    
    setTargetKeys(nextTargetKeys);
    migrationStore.handleSelectedTarget(nextTargetKeys) 
  };

  const toggleDisabled = (checked: boolean) => {
    setDisabled(checked);
  };

  useEffect(()=>{
    migrationStore.getAvailableTerms();
  },[])

  return (
    <div>
        <Row
            style={{

            }}
            justify={'center'}
            align={'middle'}
        >
            {
                migrationStore.messages.map(m=>{
                    return(<Alert message={m.message} type={m.type}
                        key={m.id}
                        style={{
                            width:'60%',
                            height:'50px',
                            textAlign:'center',
                            margin:'10px'
                        }}
                        showIcon
                    />)
                })
            }
        </Row>
        <Row
            style={{
                width:'100%'
            }}
        >
            <Col span={12}>
                {'Source Term   '}
                <Select
                  defaultActiveFirstOption
                  style={{ width: 200 }}
                  options={migrationStore.availableTerms.map(m => ({
                    value: m.id,
                    label: m.year + ' ' + m.season
                  }))}
                  value = {migrationStore.selectedTerms.source}
                  onSelect={(selected)=>{
                    migrationStore.handleTermSelection(selected, 'source')
                  }}
                />
            </Col>
            <Col span={12}>
                {'Target Term   '}
                <Select
                  defaultActiveFirstOption
                  style={{ width: 200 }}
                  options={migrationStore.availableTerms.map(m => ({
                    value: m.id,
                    label: m.year + ' ' + m.season
                  }))}
                  value = {migrationStore.selectedTerms.target}
                  onSelect={(selected)=>{
                    migrationStore.handleTermSelection(selected, 'target')
                  }}
                />
            </Col>
        </Row>
        <br />
        <Row>
          <Col span={14}>
            {'Select Transfer Object  '}
            <Select
              defaultActiveFirstOption
              style={{ width: 200, marginLeft:'5px' }}
              options={migrationStore.transferObjects}
              defaultValue={'coursesemester'}
              value = {migrationStore.selectedTransferObject}
              onSelect={(selected)=>{
                migrationStore.handleTransferObject(selected)
              }}
            />
          </Col>
          {migrationStore.selectedTransferObject==='coursesemester'&&<Col span={10}>
            {'Transfer with course group:  '}
            {/* {'  Yes   '} */}
            <Switch
              unCheckedChildren= "No" 
              checkedChildren="Yes"
              checked={migrationStore.transferWIthCourseGroup}
              onChange={()=>migrationStore.toogletransferWIthCourseGroup()}
            />
          </Col>}
          {migrationStore.selectedTransferObject==='coursegroup'&&<Col span={10}>
            <Select
              defaultActiveFirstOption
              style={{ width: 200, marginLeft:'5px' }}
              options={migrationStore.courseSemesters.map(d=>({
                label: d.program + '-Semester ' + d.semester_num,
                value: d.key
              }))}
              // defaultValue={'coursesemester'}
              value = {migrationStore.selectedCourseSemester}
              onSelect={(selected)=>{
                migrationStore.handleselectedCourseSemester(selected)
              }}
            />
          </Col>
          }
        </Row>
        <br />
        <Row
          style={{
            margin:5,
          }}
        >
          <Col span={14}>
          <Switch
            unCheckedChildren= "Unlocked! Click to lock " 
            checkedChildren="Transfer is loked! Click to lock it"
            checked={disabled}
            onChange={toggleDisabled}
          />
          </Col>
          <Col span={10}>
              <Button
                color="cyan"
                type='text'
                disabled={migrationStore.selectedTargetkeys.length===0}
                icon={<FcRefresh/>}
                onClick={()=>migrationStore.handleRefresh()}
                >Cancel</Button>
              <Button
                icon={<FaRegSave/>}
                color="cyan"
                type='primary'
                onClick={()=>migrationStore.handleSave()}
              >Save</Button>
          </Col>
        </Row>
        <Flex align="start" gap="middle" vertical>
          
          <TableTransfer
            dataSource={migrationStore.dataSource}
            targetKeys={migrationStore.selectedTargetkeys}
            disabled={disabled}
            showSearch
            showSelectAll={false}
            onChange={onChange}
            filterOption={filterOption}
            leftColumns={migrationStore.transferObjects.find((t:any)=>t.value===migrationStore.selectedTransferObject)?.columns}
            rightColumns={migrationStore.transferObjects.find((t:any)=>t.value===migrationStore.selectedTransferObject)?.columns}
          />
        </Flex>
    </div>
  );
})
export default Migration;