import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EditProfile.module.scss';
import { ProfileInterface } from '../../../instances/interfaces';
import {DragDropContext, Draggable, Droppable, DropResult} from '@hello-pangea/dnd';
import axios from '../../../instances/axios';
import arrowRightIcon from '../../../assets/images/arrow-right-icon.png';
import Loading from '../loading/Loading';
import Passion from './childComponents/passions/Passion';
import Language from './childComponents/languages/Language';
import Basics from './childComponents/basics/Basics';
import Lifestyle from './childComponents/lifestyle/Lifestyle';
import LookingFor from './childComponents/lookingFor/LookingFor';
import OpenTo from './childComponents/openTo/OpenTo';
import Swal from 'sweetalert2';
import ogAxios from 'axios';
import Compressor from 'compressorjs';

export default function EditProfile() {
    const [loading, setLoading] = useState(true);
    const [enabled, setEnabled] = useState(false);
    const [editOption, setEditOption] = useState<null | string>(null);
    const [editBasics, setEditBasics] = useState<null | string>(null);
    const [editLifestyle, setEditLifestyle] = useState<null | string>(null);

    const [profileDetails, setProfileDetails] = useState<ProfileInterface | undefined>(undefined);

    const [name, setName] = useState<string | undefined>();
    const [bio, setBio] = useState<string | undefined>();
    const [job, setJob] = useState<string | undefined>();
    const [company, setCompany] = useState<string | undefined>();
    const [school, setSchool] = useState<string | undefined>();
    const [livingIn, setLivingIn] = useState<string | undefined>();
    const [height, setHeight] = useState<string | undefined>();
    const [gender, setGender] = useState<string | undefined>();
    const [medias, setMedias] = useState([]);
    const [imgLoaded, setImgLoaded] = useState<number[]>([]);

    const navigate = useNavigate();
    const mediaInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
          cancelAnimationFrame(animation);
          setEnabled(false);
        };
      }, []);

    useEffect(() => {
        axios.get('/user/get-details').then(response => {
            if (response.status === 200) {
                setProfileDetails(response.data);
                setName(response?.data?.profile?.name ? response.data.profile.name : undefined);
                setBio(response?.data?.profile?.bio ? response.data.profile.bio : undefined);
                setJob(response?.data?.profile?.job?.title ? response.data.profile.job.title : undefined);
                setCompany(response?.data?.profile?.job?.company ? response.data.profile.job.company : undefined);
                setSchool(response?.data?.profile?.school ? response.data.profile.school : undefined);
                setHeight(response?.data?.profile?.height ? response.data.profile.height : undefined);
                setLivingIn(response?.data?.profile?.livingIn ? response.data.profile.livingIn : undefined);
                setGender(response?.data?.gender ? response.data.gender : undefined);
                setMedias(response?.data?.profile?.medias ? response?.data?.profile?.medias : []);
            }
        }).catch(() => {
            navigate('/home');
        }).finally(() => {
            setLoading(false);
        });
    }, [navigate, editOption, editBasics, editLifestyle]);
    

    const handleOnDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }
        const updatedImages = [...medias];
        const [movedImage] = updatedImages.splice(result.source.index, 1);
        updatedImages.splice(result.destination.index, 0, movedImage);

        setMedias(updatedImages);
        axios.put('/user/reorder-media', {medias: updatedImages}, {
            headers: {
                "Content-Type": "application/json",
            }
        });
    }

    useEffect(() => {
        const cancelToken = ogAxios.CancelToken.source();
        const formData = {
            profile: {
                name,
                bio,
                job: {title: job, company: company},
                school,
                height,
                livingIn: livingIn,
            },
            gender,
        };
        axios.put('/user/update-details', {data: formData}, {
            cancelToken: cancelToken.token,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        return () => cancelToken.cancel();
    }, [bio, name, job, school, height, livingIn, gender, company, navigate]);


    const handleUpload = async (selectedImage: File | undefined) => {
        if (!selectedImage) return;
        Swal.fire({
            didOpen: () => {
                Swal.showLoading();
            },
            background: 'transparent',
            backdrop: true,
        });
        const compressedImage = await new Promise<File | Blob>((resolve) => {
            new Compressor(selectedImage, {
                quality: 0.5,
                success: (file) => resolve(file),
                resize: 'cover',
                strict: false,
                convertSize: 2000000,
            });
        });

        axios.post('/user/upload-media', {file: compressedImage}, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then((response) => {
            setMedias(response.data);
        }).finally(() => Swal.close());
    };

    const handleRemoveMedia = (media: string) => {
        if (medias.length === 1) {
            Swal.fire({
                title: "Cannot remove media",
                text: "Should keep atleast one image",
                icon: "warning",
                backdrop: true,
                background: 'black',
                color: 'white',
            });
            return;
        }
        Swal.fire({
            didOpen: () => {
                Swal.showLoading();
            },
            background: 'transparent',
            backdrop: true,
        });
        axios.post(`/user/remove-media`, {media}, {
            headers: {'Content-Type': 'application/json'},
        }).then(response => setMedias(response.data))
        .finally(() => Swal.close());
    }

    if (!enabled || loading) {
        return <Loading />;
    }
    
    return (
        <div className={`${styles.edit}`}>
            <div className={styles.heading}>
                <span>Edit Info</span>
                <span className={styles['done-button']} onClick={() => navigate('/app/account')}>Done</span>
            </div>
            
            <div style={{overflow: 'auto'}}>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId='image-grid' direction='horizontal'>
                        {(provided) => (
                            <div className={`${styles.medias}`} {...provided.droppableProps} ref={provided.innerRef}>
                                {medias?.map((media: string, index) => (
                                    <Draggable key={media} draggableId={media} index={index}>
                                        {(provided) => (
                                            <div className={`col-4 ${styles['media-item']}`} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <img src={media} alt="media" loading="lazy" onLoad={() => setImgLoaded((pre) => [...pre, index])} />
                                                {!imgLoaded.includes(index) && <i className={`fa-solid fa-circle-notch fa-spin ${styles.add}`}></i>}

                                                <i onClick={() => handleRemoveMedia(media)} className={`fa-solid fa-circle-minus ${styles.delete}`}></i>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                                {medias && Array(9 - medias?.length).fill(null).map((_, index) => (
                                    <div onClick={() => mediaInput.current?.click()} key={`add-${index}`} className={`col-4 ${styles['media-item']}`}>
                                        <i className={`fa-solid fa-file-circle-plus ${styles.add}`}></i>
                                    </div>
                                ))}
                                <input onChange={(e) => handleUpload(e?.target?.files ? e.target.files[0] : undefined)} ref={mediaInput} type="file" accept='image/*' hidden />
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <div className={`col-12 ${styles['media-description']}`}>
                    <p>Add media to get 5% closer to completing your profile and may even get more Likes</p>
                </div>
            </div>
            <div className={styles['detail']}>
                <h6>Display Name</h6>
                <input placeholder='Name to be displayed on profile' value={name ? name : ''} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className={styles['detail']}>
                <h6>About You</h6>
                <textarea rows={3} defaultValue={bio ? bio : ''} onChange={(e) => setBio(e.target.value)} placeholder='Bio here...'></textarea>
                <p>Do not include social media handles or other contact information in your bio.</p>
            </div>
            <div onClick={() => setEditOption('passions')} className={styles['detail']}>
                <h6>Passions</h6>
                <div>
                    {(profileDetails && Object.keys(profileDetails?.profile?.passions).length) ?
                    <span>
                        {profileDetails?.profile?.passions?.map(passion => {
                            return passion+', ';
                        })}
                    </span>
                    :
                    <span>Add passions</span>
                    }
                    <button><img src={arrowRightIcon}/></button>
                </div>
            </div>

            <div className={styles['detail']}>
                <h6>Height (cm)</h6>
                <input type='number' placeholder='Enter your height in cm' value={height ? height : ''} onChange={(e) => setHeight(e.target.value)} />
            </div>
            
            <div onClick={() => setEditOption('lookingFor')} className={styles['detail']}>
                <h6>Relationship Looking For</h6>
                <div>
                    {(profileDetails && profileDetails?.profile?.relationship?.lookingFor) ?
                    <span>{profileDetails.profile.relationship.lookingFor}</span>
                    :
                    <span>Add your goal</span>
                    }
                    <button> <img src={arrowRightIcon}/> </button>
                </div>
            </div>
            <div onClick={() => setEditOption('openTo')} className={styles['detail']}>
                <h6>Relationship Open To</h6>
                <div>
                    {(profileDetails && Object.keys(profileDetails?.profile?.relationship?.openTo).length) ?
                    <span>
                        {profileDetails?.profile?.relationship?.openTo?.map(to => {
                            return to+', ';
                        })}
                    </span>
                    :
                    <span>Add your types</span>
                    }
                    <button><img src={arrowRightIcon}/></button>
                </div>
            </div>
            <div onClick={() => setEditOption('languages')} className={styles['detail']}>
                <h6>Languages I Speak</h6>
                <div>
                    {(profileDetails && Object.keys(profileDetails?.profile?.languages).length) ?
                    <span>
                        {profileDetails?.profile?.languages?.map(language => {
                            return language+', ';
                        })}
                    </span>
                    :
                    <span>Add languages you speak</span>
                    }
                    <button><img src={arrowRightIcon}/></button>
                </div>
            </div>
            <div className={styles.detail}>
                <h6>Basics</h6>
                <div onClick={() => setEditBasics('zodiac')} className='border-bottom-0'>
                    <span>Zodiac</span>
                    <button>
                        {profileDetails && <span>{profileDetails?.profile?.basics?.zodiac}</span>}
                        <img src={arrowRightIcon}></img>
                    </button>
                </div>
                <div onClick={() => setEditBasics('education')} className='border-bottom-0'>
                    <span>Education</span>
                    <button>
                        {profileDetails && <span>{profileDetails?.profile?.basics?.education}</span>}
                        <img src={arrowRightIcon}></img>
                    </button>
                </div>
                <div onClick={() => setEditBasics('familyPlan')} className='border-bottom-0'>
                    <span>Family Plans</span>
                    <button>
                        {profileDetails && <span>{profileDetails?.profile?.basics?.familyPlan}</span>}
                        <img src={arrowRightIcon}></img>
                    </button>
                </div>
                <div onClick={() => setEditBasics('vaccinated')} className='border-bottom-0'>
                    <span>Covid Vaccine</span>
                    <button>
                        {profileDetails && <span>{profileDetails?.profile?.basics?.vaccinated}</span>}
                        <img src={arrowRightIcon}></img>
                    </button>
                </div>
                <div onClick={() => setEditBasics('personality')} className='border-bottom-0'>
                    <span>Personality Type</span>
                    <button>
                        {profileDetails && <span>{profileDetails?.profile?.basics?.personality}</span>}
                        <img src={arrowRightIcon}></img>
                    </button>
                </div>
                <div onClick={() => setEditBasics('communication')} className='border-bottom-0'>
                    <span>Communication style</span>
                    <button>
                        {profileDetails && <span>{profileDetails?.profile?.basics?.communication}</span>}
                        <img src={arrowRightIcon}></img>
                    </button>
                </div>
                <div onClick={() => setEditBasics("loveStyle")}>
                    <span>Love Style</span>
                    <button>
                        {profileDetails && <span>{profileDetails?.profile?.basics?.loveStyle}</span>}
                        <img src={arrowRightIcon}></img>
                    </button>
                </div>
            </div>

            <div className={styles.detail}>
                <h6>Lifestyle</h6>
                <div onClick={() => setEditLifestyle('pets')} className='border-bottom-0'>
                    <span>Pets</span>
                    <button>
                        {profileDetails && <span>{profileDetails?.profile?.lifestyle?.pets}</span>}
                        <img src={arrowRightIcon}></img>
                    </button>
                </div>
                <div onClick={() => setEditLifestyle('drink')} className='border-bottom-0'>
                    <span>Drinking</span>
                    <button>
                        {profileDetails && <span>{profileDetails?.profile?.lifestyle?.drink}</span>}
                        <img src={arrowRightIcon}></img>
                    </button>
                </div>
                <div onClick={() => setEditLifestyle('smoke')} className='border-bottom-0'>
                    <span>Smoking</span>
                    <button>
                        {profileDetails && <span>{profileDetails?.profile?.lifestyle?.smoke}</span>}
                        <img src={arrowRightIcon}></img>
                    </button>
                </div>
                <div onClick={() => setEditLifestyle('workout')} className='border-bottom-0'>
                    <span>Workout</span>
                    <button>
                        {profileDetails && <span>{profileDetails?.profile?.lifestyle?.workout}</span>}
                        <img src={arrowRightIcon}></img>
                    </button>
                </div>
                <div onClick={() => setEditLifestyle('diet')} className='border-bottom-0'>
                    <span>Dietary Preference</span>
                    <button>
                        {profileDetails && <span>{profileDetails?.profile?.lifestyle?.diet}</span>}
                        <img src={arrowRightIcon}></img>
                    </button>
                </div>
                <div onClick={() => setEditLifestyle('socialMedia')} className='border-bottom-0'>
                    <span>Social Media</span>
                    <button>
                        {profileDetails && <span>{profileDetails?.profile?.lifestyle?.socialMedia}</span>}
                        <img src={arrowRightIcon}></img>
                    </button>
                </div>
                <div onClick={() => setEditLifestyle('sleep')}>
                    <span>Sleeping Habits</span>
                    <button>
                        {profileDetails && <span>{profileDetails?.profile?.lifestyle?.sleep}</span>}
                        <img src={arrowRightIcon}></img>
                    </button>
                </div>
            </div>
            <div className={styles.detail}>
                <h6>Job Title</h6>
                <input value={job ? job : ''} onChange={(e) => setJob(e.target.value)} placeholder='Add Job Title' />
            </div>
            <div className={styles.detail}>
                <h6>Company</h6>
                <input value={company ? company : ''} onChange={(e) => setCompany(e.target.value)} placeholder='Add Company' />
            </div>
            <div className={styles.detail}>
                <h6>School</h6>
                <input value={school ? school : ''} onChange={(e) => setSchool(e.target.value)} placeholder='Add school' />
            </div>
            <div className={styles.detail}>
                <h6>Living In</h6>
                <input value={livingIn ? livingIn : ''} onChange={(e) => setLivingIn(e.target.value)} placeholder='Where you live?' />
            </div>
            
            <div style={{marginBottom: '10vh'}} className={styles.detail}>
                <h6>Gender</h6>
                <select onChange={(e) => setGender(e.target.value)}>
                    <option selected={(gender && gender === 'male') ? true : false} value="male">Male</option>
                    <option selected={(gender && gender === 'female')  ? true : false} value="female">Female</option>
                </select>
            </div>

            {(editOption || editBasics ||editLifestyle) &&
            <div className={`${styles['edit-option']}`}>
                <button onClick={() => {setEditOption(null); setEditBasics(null); setEditLifestyle(null)}}>Done</button>
                {editOption === 'lookingFor' && <LookingFor lookingForSelected={profileDetails && profileDetails?.profile?.relationship?.lookingFor} />}
                {editOption === 'openTo' && <OpenTo openToSelected={profileDetails && profileDetails?.profile?.relationship?.openTo} />}
                {editOption === 'passions' && <Passion passionSelected={profileDetails && profileDetails?.profile?.passions} />}
                {editOption === 'languages' && <Language languageSelected={profileDetails && profileDetails?.profile?.languages} />} 
                {editBasics && <Basics basicsSelected={profileDetails && profileDetails?.profile?.basics} where={editBasics} /> }
                {editLifestyle && <Lifestyle lifestyleSelected={profileDetails && profileDetails?.profile?.lifestyle} where={editLifestyle} />}
            </div>
            }
        </div>
    );
}