require('normalize.css/normalize.css');
require('styles/main.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//get image information
let imageDatas = require('../data/imageDatas.json');

//let yeomanImage = require('../images/yeoman.png');

//transform image title to image URL using self-executing function
imageDatas = ((imageDatasArr) => {
	for (let i = 0, j = imageDatasArr.length; i < j; i++) {
		let singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

//get a random value from section
const getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);

const get30DegRandom = () => {
	return (Math.random() > 0.5 ? '+' : '-' + Math.ceil(Math.random() * 30));
}

class ImgFigure extends React.Component {
	handleClick(e) {
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	}
	render() {
		let styleObj = {};
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}
		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}
		if (this.props.arrange.rotate) {
			['MozTransform', 'msTransform', 'WebkitTransform', 'OTransform', 'transform'].map((item) => {
				styleObj[item] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			});
		}
		let imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick.bind(this)}>
			            <p>
			              {this.props.data.desc}
			            </p>
		          	</div>
				</figcaption>
			</figure>
		);
	}
}

class ControllerUnit extends React.Component {
	handleClick(e) {
		if (!this.props.arrange.isCenter) {
			this.props.center();
		} else {
			this.props.inverse();
		}
		e.stopPropagation();
		e.preventDefault();
	}
	render() {
		let controllerUnitsClassName = "controller-unit";
		controllerUnitsClassName += (this.props.arrange.isCenter) ? ' is-center' : '';
		controllerUnitsClassName += (this.props.arrange.isInverse) ? ' is-inverse' : '';
		return (
			<span className={controllerUnitsClassName} onClick={this.handleClick.bind(this)}></span>
		);
	}
}


class GalleryByReactApp extends React.Component {
	constructor(props) {
		super(props);
		this.Constant = {
			centerPos: {
				left: 0,
				right: 0
			},
			hPosRange: { //horizontal scope
				leftSecX: [0, 0],
				rightSecX: [0, 0],
				y: [0, 0]
			},
			vPosRange: { //vertical scope
				x: [0, 0],
				topY: [0, 0]
			}
		};
		this.state = {
			imgsArrangeArr: [{
				pos: {
					left: '0',
					top: '0'
				},
				rotate: 0, //旋转角度
				isInverse: false, //正反面
				isCenter: false
			}]
		};
	}

	/*
	 *
	 *
	 *
	 */
	inverse(index) {
		return function() {
			let imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse; // 翻转取反
			this.setState({
				imgsArrangeArr: imgsArrangeArr // 触发视图的重新渲染
			});
		}.bind(this);
	}

	/*
	 *
	 *
	 *
	 */
	center(index) {
		return function() {
			this.rearrange(index);
		}.bind(this);
	}

	/*
	 * rearrange all images position
	 * @param centerIndex assgin the image whcih need to be center.
	 */
	rearrange(centerIndex) {
		let imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,
			imgsArrangTopArr = [],
			topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
			topImgSpiceIndex = 0,
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
		//首先居中centerIndex图片 ,centerIndex图片不需要旋转
		imgsArrangeCenterArr[0] = {
			pos: centerPos,
			rotate: 0,
			isCenter: true
		}

		//取出要布局上测的图片的状态信息
		topImgSpiceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangTopArr = imgsArrangeArr.splice(topImgSpiceIndex, topImgNum);
		//布局位于上侧的图片
		imgsArrangTopArr.forEach((value, index) => {
			imgsArrangTopArr[index] = {
				pos: {
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			};
		});

		//布局左右两侧的图片
		for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
			let hPosRangeLORX = null;
			//left images, right images
			if (i < k) {
				hPosRangeLORX = hPosRangeLeftSecX;
			} else {
				hPosRangeLORX = hPosRangeRightSecX
			}
			imgsArrangeArr[i] = {
				pos: {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			};
		}
		if (imgsArrangTopArr && imgsArrangTopArr[0]) {
			imgsArrangeArr.splice(topImgSpiceIndex, 0, imgsArrangTopArr[0]);
		}
		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});
	}
	componentDidMount() {
		//get stage size
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,

			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		//get one imgFigure size
		let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,

			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);

		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}

		//count left and right area scope
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;
		//count top area scope
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		let num = Math.floor(Math.random() * 10);
		this.rearrange(num);

	}
	render() {
		let controllerUnits = [],
			imgFigures = [];
		imageDatas.forEach((value, index) => {
			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				}
			}
			imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index).bind(this)}/>);
			controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index).bind(this)}/>);
		});
		return (
			<section className="stage" ref="stage">
					<section className="img-sec">
					{imgFigures}
					</section>
					<nav className="controller-nav">
					{controllerUnits}
					</nav>
				</section>
		);
	}
}

GalleryByReactApp.defaultProps = {};

export default GalleryByReactApp;