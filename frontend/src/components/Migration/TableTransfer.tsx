import React, { useState } from 'react';
import { Flex, Switch, Table, Tag, Transfer } from 'antd';
import type { GetProp, TableColumnsType, TableProps, TransferProps } from 'antd';
import migrationStore from '../../mobx/MigrationStore';

type TransferItem = GetProp<TransferProps, 'dataSource'>[number];
type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];

interface TableTransferProps extends TransferProps<TransferItem> {
    dataSource: any[];
    leftColumns: TableColumnsType<any>;
    rightColumns: TableColumnsType<any>;
  }

const TableTransfer: React.FC<TableTransferProps> = (props) => {
    const { leftColumns, rightColumns, ...restProps } = props;
    return (
      <Transfer 
        style={{ width: '100%' }} {...restProps}
        titles={[
          ''+migrationStore.getTermName('source'),
          ''+migrationStore.getTermName('target'),
          ]}
          oneWay
      >
        {({
          direction,
          filteredItems,
          onItemSelect,
          onItemSelectAll,
          selectedKeys: listSelectedKeys,
          disabled: listDisabled,
        }) => {
          const columns = direction === 'left' ? leftColumns : rightColumns;
          const rowSelection: TableRowSelection<TransferItem> = {
            getCheckboxProps: () => ({ disabled: listDisabled }),
            onChange(selectedRowKeys) {
              onItemSelectAll(selectedRowKeys, 'replace');
            },
            selectedRowKeys: listSelectedKeys,
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
          };
  
          return (
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredItems}
              size="small"
              style={{ pointerEvents: listDisabled ? 'none' : undefined }}
              onRow={({ key, disabled: itemDisabled }) => ({
                onClick: () => {
                  if (itemDisabled || listDisabled) {
                    return;
                  }
                  onItemSelect(key, !listSelectedKeys.includes(key));
                },
              })}
            />
          );
        }}
      </Transfer>
    );
  };

  export default TableTransfer;