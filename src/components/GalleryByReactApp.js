require('normalize.css/normalize.css');
require('styles/main.scss');

import React from 'react';

//get image information
let imageDatas = require('../data/imageDatas.json');

//let yeomanImage = require('../images/yeoman.png');

//transform image title to image URL using self-executing function
imageDatas = (function genImageURL(imageDatasArr) {
	for (let i = 0, j = imageDatasArr.length; i < j; i++) {
		let singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);


class GalleryByReactApp extends React.Component {
	render() {
		return (
			<section className="stage">
				<section className="img-sec">
				</section>
				<nav className="controller-nav">
				</nav>
			</section>
		);
	}
}

GalleryByReactApp.defaultProps = {};

export default GalleryByReactApp;