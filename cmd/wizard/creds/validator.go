package creds

import (
	"fmt"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/sts"
)

func ValidateAWSCredentials(accessKeyID, secretAccessKey, region string) error {
	sess, err := session.NewSession(&aws.Config{
		Region:      aws.String(region),
		Credentials: credentials.NewStaticCredentials(accessKeyID, secretAccessKey, ""),
	})

	if err != nil {
		return err
	}

	svc := sts.New(sess)
	_, err = svc.GetCallerIdentity(nil)

	if err != nil {
		return fmt.Errorf("invalid AWS credentials: %v", err)
	}

	return nil
}