/*
 * 2051565 GTY
 * 创建于2024年1月6日 湖南省长沙市（沪昆线）
 */

import './InfoCard.css'

interface Info {
    key: string
    value: string
    separator: string
}

export class InfoCardBuilder {

    protected infoList: Info[] = []
    infoTextSize = 18
    iconUrl: string = ''
    iconSize = 56
    footNote: string = ''
    footNoteSize = 36
    title: string = ''
    titleSize = 24
    marginLeft = 0
    marginRight = 0
    marginTop = 0
    marginBottom = 0

    static new(): InfoCardBuilder {
        return new InfoCardBuilder
    }

    setTitle(s: string): InfoCardBuilder {
        this.title = s
        return this
    }

    addInfo(
        key: string, value: string, separator: string = ': '
    ): InfoCardBuilder {
        this.infoList.push({
            key: key,
            value: value,
            separator: separator
        })
        return this
    }

    setFootNote(s: string): InfoCardBuilder {
        this.footNote = s
        return this
    }

    setTopMargin(i: number): InfoCardBuilder {
        this.marginTop = i
        return this
    }

    setBottomMargin(i: number): InfoCardBuilder {
        this.marginBottom = i
        return this
    }

    setLeftMargin(i: number): InfoCardBuilder {
        this.marginLeft = i
        return this
    }

    setRightMargin(i: number): InfoCardBuilder {
        this.marginRight = i
        return this
    }

    setIconUrl(url: string): InfoCardBuilder {
        this.iconUrl = url
        return this
    }

    build(): React.ReactNode {
        return <div
            style={{
                position: 'relative',
                border: '1px solid #7777',
                borderRadius: 16,
                boxSizing: 'border-box',
                padding: 8,
                marginLeft: this.marginLeft,
                marginRight: this.marginRight,
                marginTop: this.marginTop,
                marginBottom: this.marginBottom,

                display: 'flex',
                flexDirection: 'row',

                transition: '0.1s'
            }}

            className='info-card'
        >

            {
                this.iconUrl === '' ? '' :
                    <img src={ this.iconUrl } width={this.iconSize} />
            }

            <div style={{ width: 16 }} />

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >

                {
                    this.title === '' ? '' :
                        [
                            <div style={{ fontSize: this.titleSize }} >
                                { this.title }
                                
                            </div> ,
                            <div style={{ height: 4 }} /> ,
                        ]
                }

                {
                    this.infoList.map(info => {
                        return <div 
                            style={{ 
                                fontSize: this.infoTextSize,
                                display: 'flex',
                                flexDirection: 'row',
                                marginTop: 1 
                            }} 
                        >
                            <div
                                style={{
                                    flexShrink: 0
                                }}
                            >
                                {info.key}{info.separator}
                            </div>

                            <div
                                style={{
                                    flexGrow: 1,
                                    marginLeft: 12,
                                }}
                            >
                                {info.value}
                            </div>
                        
                        </div>
                    })
                }

            </div>

            {
                this.footNote === '' ? '' :
                    <div
                        style={{
                            fontSize: this.footNoteSize,
                            position: 'absolute',
                            right: 16,
                            bottom: 16
                        }}
                    >
                        { this.footNote }
                    </div>
            }

        </div>
    }    

}
