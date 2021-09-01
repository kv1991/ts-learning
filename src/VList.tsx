import React from 'react';
import { Empty } from 'antd';

import { binarySearch, CompareResult } from "./bst";

interface Props {
  height: number,
  total: number,
  estimateRowHeight: number,
  bufferSize: number,
  rowRenderer: (i: number, scrollTop: any) => void
}

interface CachedPosition {
  index: number;
  top: number;
  bottom: number;
  height: number;
  dValue: number;
}

export default class VirtualList extends React.Component<Props> {
	state = {
		scrollTop: 0
	};

  height = this.props.height;
  total = this.props.total;
  estimatedRowHeight = this.props.estimateRowHeight;
  bufferSize = this.props.bufferSize || 5;

  scrollingContainer = React.createRef<HTMLDivElement>();
  phantomContentRef = React.createRef<HTMLDivElement>();
  actualContentRef = React.createRef<HTMLDivElement>();

	limit = Math.ceil(this.height / this.estimatedRowHeight);

	originStartIdx = 0;

 	startIndex = 0;
  endIndex = Math.min(
    this.originStartIdx + this.limit + this.bufferSize,
    this.total - 1
  );

  cachedPositions: CachedPosition[] = [];
  phantomHeight = this.estimatedRowHeight * this.total;

  constructor(props: Props) {
    super(props);
    this.initCachedPositions();
  }

  componentDidMount() {
    if (this.actualContentRef.current && this.total > 0) {
      this.updateCachedPositions();
    }
  }

  componentDidUpdate() {
    if (this.total !== this.props.total) {
      this.total = this.props.total;
      this.resetAllVirtualParam()
    }
  }

  resetAllVirtualParam = () => {
    this.originStartIdx = 0;
    this.startIndex = 0;
    this.endIndex = Math.min(
      this.originStartIdx + this.limit + this.bufferSize,
      this.total - 1
    );
    this.scrollingContainer!.current!.scrollTop = 0;
    //reset phatom height
    this.phantomHeight = this.estimatedRowHeight * this.total;
    this.setState({ scrollTop: 0 });
  }

  updateCachedPositions = () => {
    const nodes: NodeListOf<any > | null = this.actualContentRef.current!.childNodes;
    // const start = nodes![0];
    // calculate height diff for each visible node...
    nodes.forEach((node: HTMLDivElement) => {
      if (!node) {
        return;
      }
      const rect = node.getBoundingClientRect();
      const { height } = rect;
      console.log('height: ', height);
      const index = Number(node.id.split('-')[1]);
      const oldHeight = this.cachedPositions[index].height;
      const dValue = oldHeight - height;
      if (dValue) {
        this.cachedPositions[index].height = height;
        this.cachedPositions[index].dValue = dValue;
        this.cachedPositions[index].bottom -= dValue;
      }
    })
    // perform one time height update...
    // let startIdx = 0;
    // if (start) {
    //   startIdx = Number(start.id.split('-')[1]);
    // }
    // const cachedPositionsLen = this.cachedPositions.length;
    // let cumulativeDiffHeight = this.cachedPositions[startIdx].dValue;
    // this.cachedPositions[startIdx].dValue = 0;
    // for (let i = startIdx + 1; i < cachedPositionsLen; ++ i) {
    //   const item = this.cachedPositions[i];// update height
    //   this.cachedPositions[i].top = this.cachedPositions[i - 1].bottom;
    //   this.cachedPositions[i].bottom = this.cachedPositions[i].bottom - cumulativeDiffHeight;

    //   if (item.dValue !== 0) {
    //     cumulativeDiffHeight += item.dValue;
    //     item.dValue = 0;
    //   }
    // }

    // // update our phantom div height
    // const height = this.cachedPositions[cachedPositionsLen - 1].bottom;
    // this.phantomHeight = height;
    // this.phantomContentRef!.current!.style.height = `${height}px`;
  }

  initCachedPositions = () => {
    this.cachedPositions = [];
    for (let i = 0; i < this.total; i++) {
      this.cachedPositions[i] = {
        index: i,
        height: this.estimatedRowHeight,
        top: i * this.estimatedRowHeight,
        bottom: (i + 1) * this.estimatedRowHeight,
        dValue: 0
      }
    }
  }

  getStartIndex = (scrollTop = 0) => {
    let idx = binarySearch<CachedPosition, number>(
  		this.cachedPositions,
  		scrollTop,
  		(currentValue, targetValue) => {
  			const currentCompareValue = currentValue.bottom;
  			if (currentCompareValue === targetValue) {
  				return CompareResult.eq;
  			}
  			if (currentCompareValue < targetValue) {
					return CompareResult.lt;
  			}
  			return CompareResult.gt;
  		}
  	);
    console.log('idx: ', idx);
  	const targetItem = this.cachedPositions[idx];
  	if (targetItem.bottom < scrollTop) {
  		idx += 1;
  	}
  	return idx;
  }

  onScroll = (evt: any) => {
  	if (evt.target === this.scrollingContainer.current) {
  		console.log('scrolling...');
  		const { scrollTop } = evt.target;
  		console.log(scrollTop);
  		const { originStartIdx, bufferSize, total } = this;
  		const currentStartIndex =  this.getStartIndex(scrollTop);
  		if (currentStartIndex !== originStartIdx) {
  			this.originStartIdx = currentStartIndex;
  			this.startIndex = Math.max(this.originStartIdx - bufferSize, 0);
  			this.endIndex = Math.min(this.originStartIdx + this.limit + bufferSize, total - 1);
  			this.setState({ scrollTop });
  		}
  	}
  }

  getTransform = () => {
  	return `
      translateY(${this.startIndex >= 1 ? this.cachedPositions[this.startIndex - 1].bottom : 0}px)
  	`;
  }

	renderDisplayContent = () => {
		const content = [];
		for(let i = this.startIndex; i <= this.endIndex; ++i) {
			content.push(this.props.rowRenderer(i, {
          left: 0,
          right: 0,
          width: "100%"
        }))
		}
		return content;
	}

	render() {
		const { height, phantomHeight, total } = this;
		return (
			<div
				ref={this.scrollingContainer}
        style={{
          overflowX: "hidden",
          overflowY: "auto",
          height,
          position: "relative"
        }}
				onScroll={this.onScroll}
			>
				<div ref={this.phantomContentRef} style={{ height: phantomHeight, position: "relative"}} />					
				<div
					ref={this.actualContentRef}
					style={{
						width: '100%',
						position: 'absolute',
						top: 0,
						transform: this.getTransform()
					}}
				>
					{this.renderDisplayContent()}
				</div>
				{!total && (<Empty />)}
			</div>
		);
	}
}