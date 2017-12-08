/**
 * Created by Anatoly on 28.07.2016.
 */

import * as React from 'react';
import {SVG} from 'module/ui/svg';
import {PaginationModel} from "./model/pagination-model";
import * as classNames from 'classnames';

export interface PaginationProps {
    model: PaginationModel
}

export class Pagination extends React.Component<PaginationProps, {}> {

	componentWillMount() {
		const {model} = this.props;

		model.addListener();
		model.onShowBtnUp = () => this.onRender();
	}

	componentWillUnmount() {
		this.props.model.removeListeners();
	}

	onRender(){
		this.setState({scrollY: window.scrollY});
	}

	render() {
		const   {model} = this.props,
				classes = classNames({
					bPagination:	true,
					mLoading: 		model.isLoading,
					mLast:			model.isLastPage,
					mScrolled: 		model.isScrolled
				});

		return (
			<div className={classes}>
				<span className="bButton" onClick={model.nextPage.bind(model)}>More</span>
				<div className="eLoader"><SVG icon="icon_spin-loader-black" /></div>
				<div className="bButton mUp" onClick={model.onScrollTop}>Up ↑</div>
			</div>
		);
	}
}