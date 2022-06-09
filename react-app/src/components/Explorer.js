import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import HtmlIcon from '@mui/icons-material/Html';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { RavencodeFolderData } from '../util/SharepointUtil';

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 16,
    paddingLeft: 5,
    borderLeft: `1px dashed`
  },
}));

function StyledTreeItem(props) {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.2, pr: 0 }}>
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

/**
 * @param {[RavencodeFolderData]} props.treeData This is the data to render.
 * @returns 
 */
export default function Explorer(props) {

  const renderTree = (node) => (
    <StyledTreeItem 
      key={node.id}
      nodeId={node.id}
      labelText={node.dataName}
      labelIcon={(
        node.type === "folder" ? FolderIcon : (
          node.ext === "txt" ? TextSnippetIcon : (
            node.ext === "html" ? HtmlIcon : InsertDriveFileIcon
          )
        )
      )}
      value={"test"}
      onDoubleClick={node.type === "folder" 
        ? null 
        : () => {
          props.util.getTextFileData(node.path)
            .then((data) => {
              props.setOriginalCode(pData => data);
              props.setCode(pData => data);
            });
          props.setEditorFns(prevFunctions => {
            return {
              ...prevFunctions,
              saveFilePath: node.path
            };
          })
        }} // Each node doesn't have a value. so the alternative is to customise the functions.
    >
      {node.children.length > 0
        ? node.children.map((node) => renderTree(node))
        : null}
    </StyledTreeItem>
  );

  return (
    <TreeView
      aria-label="explorer"
      defaultExpanded={[]}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
      // onDoubleClick={handleDblClick}
    >
      {props.treeData.map((node) => renderTree(node))}
    </TreeView>
  );
}
